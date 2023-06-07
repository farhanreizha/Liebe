const ReactionRole = require("../../Models/ReactionRoles")
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js")

module.exports = {
   data: new SlashCommandBuilder()
      .setName("panel")
      .setDescription("Display reaction role panel.")
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
   /**
    *
    * @param {import("discord.js").Interaction} interaction
    */
   async execute(interaction) {
      const { guildId, guild, channel } = interaction

      try {
         const data = await ReactionRole.findOne({ GuildID: guildId })

         if (!data.Roles.length > 0) return interaction.reply({ content: "This server dose not have any data.", ephemeral: true })

         const panelEmbed = new EmbedBuilder().setColor("Aqua").setDescription("**Please select a role below.**")

         const options = data.Roles.map((x) => {
            const role = guild.roles.cache.get(x.roleId)

            return {
               label: role.name,
               value: role.id,
               description: x.roleDescription,
               emoji: x.roleEmoji || undefined,
            }
         })

         const menuComponents = [
            new ActionRowBuilder().addComponents(
               new StringSelectMenuBuilder().setCustomId("reaction-role").setMaxValues(options.length).addOptions(options)
            ),
         ]

         channel.send({ embeds: [panelEmbed], components: menuComponents })
         return interaction.reply({ content: "Successfully sent your panel.", ephemeral: true })
      } catch (error) {
         console.error(error)
      }
   },
}
