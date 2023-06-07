const { Client, PermissionFlagsBits, EmbedBuilder, InteractionType } = require("discord.js")
const Suggestion = require("../../Models/Suggestion")
const ytsr = require("@distube/ytsr")

module.exports = {
   name: "interactionCreate",
   /**
    *
    * @param {import("discord.js").Interaction} interaction
    * @param {Client} client
    */
   async execute(interaction, client) {
      // auto complete
      if (interaction.isAutocomplete()) {
         const command = client.commands.get(interaction.commandName)
         if (!command.autocomplete) return
         command.autocomplete(interaction, client)
      }

      // Input Chat Commands
      if (interaction.isChatInputCommand()) {
         const command = client.commands.get(interaction.commandName)

         if (!command) interaction.reply({ content: "outdated command" })

         command.execute(interaction, client)
      }

      // Verify Role
      else if (interaction.commandId === "verify") {
         const role = interaction.guild.roles.cache.get(client.config.roles.verificationId)
         return interaction.member.roles.add(role).then(() => interaction.reply({ content: `${role} has been assigned to you.`, ephemeral: true }))
      }

      // Select Menu
      else if (interaction.isStringSelectMenu()) {
         if (interaction.customId === "reaction-role") {
            for (let i = 0; i < interaction.values.length; i++) {
               const roleId = interaction.values[i]
               const role = interaction.guild.roles.cache.get(roleId)
               const hasRole = interaction.member.roles.cache.has(roleId)

               switch (hasRole) {
                  case true:
                     interaction.member.roles.remove(roleId)
                     break
                  case false:
                     interaction.member.roles.add(roleId)
                     break
               }
            }

            interaction.reply({ content: "Roles updated.", ephemeral: true })
         }
      }

      // Button
      else if (!interaction.isButton()) return
      else if (interaction.customId === "suggest-accept" || interaction.customId === "suggest-decline") {
         if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator))
            return interaction.reply({ content: "You don't have permissions for that.", ephemeral: true })

         Suggestion.findOne({ GuildID: interaction.guildId, MessageID: interaction.message.id }).then(async (data, error) => {
            if (error) throw error

            if (!data) return interaction.reply({ content: "No data was found.", ephemeral: true })

            const embed = interaction.message.embeds[0]

            if (!embed) return interaction.reply({ content: "No embed was found.", ephemeral: true })

            switch (interaction.customId) {
               case "suggest-accept":
                  embed.data.fields[2] = { name: "Status", value: "Accepted", inline: true }
                  const acceptedEmbed = EmbedBuilder.from(embed).setColor("Green")

                  interaction.message.edit({ embeds: [acceptedEmbed] })
                  interaction.reply({ content: "Suggestion successfully accepted.", ephemeral: true })
                  break
               case "suggest-decline":
                  embed.data.fields[2] = { name: "Status", value: "declined", inline: true }
                  const declinedEmbed = EmbedBuilder.from(embed).setColor("Red")

                  interaction.message.edit({ embeds: [declinedEmbed] })
                  interaction.reply({ content: "Suggestion successfully declined.", ephemeral: true })
                  break
            }
         })
      } else {
         return
      }
   },
}
