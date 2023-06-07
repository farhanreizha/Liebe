const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js")
const TicketSchema = require("../../Models/Ticket")

module.exports = {
   data: new SlashCommandBuilder()
      .setName("ticket")
      .setDescription("Ticket action")
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
      .addStringOption((option) =>
         option
            .setName("action")
            .setDescription("Add or remove members from the ticket.")
            .setRequired(true)
            .setChoices({ name: "Add", value: "add" }, { name: "Remove", value: "remove" })
      )
      .addUserOption((option) =>
         option.setName("member").setDescription("Select a member from the discord server to perform the action on.").setRequired(true)
      ),
   /**
    *
    * @param {import("discord.js").Interaction} interaction
    */
   async execute(interaction) {
      const { guildId, options, channel } = interaction

      const action = options.getString("action")
      const member = options.getUser("member")

      const embed = new EmbedBuilder()

      switch (action) {
         case "add":
            TicketSchema.findOne({ GuildID: guildId, ChannelID: channel.id }).then(async (data, error) => {
               if (error) throw error
               if (!data)
                  return interaction.reply({
                     embeds: [embed.setColor("Red").setDescription("Something went wrong. Try again later.")],
                     ephemeral: true,
                  })

               if (data.MembersID.includes(member.id))
                  return interaction.reply({
                     embeds: [embed.setColor("Red").setDescription("Something went wrong. Try again later.")],
                     ephemeral: true,
                  })

               data.MembersID.push(member.id)

               channel.permissionOverwrites.edit(member.id, {
                  SendMessages: true,
                  ViewChannel: true,
                  ReadMessageHistory: true,
               })

               interaction.reply({ embeds: [embed.setColor("Green").setDescription(`${member} has been added to the ticket.`)] })

               data.save()
            })
            break
         case "remove":
            TicketSchema.findOne({ GuildID: guildId, ChannelID: channel.id }).then(async (data, error) => {
               if (error) throw error
               if (!data)
                  return interaction.reply({
                     embeds: [embed.setColor("Red").setDescription("Something went wrong. Try again later.")],
                     ephemeral: true,
                  })

               if (!data.MembersID.includes(member.id))
                  return interaction.reply({
                     embeds: [embed.setColor("Red").setDescription("Something went wrong. Try again later.")],
                     ephemeral: true,
                  })

               data.MembersID.remove(member.id)

               channel.permissionOverwrites.edit(member.id, {
                  SendMessages: false,
                  ViewChannel: false,
                  ReadMessageHistory: false,
               })

               interaction.reply({ embeds: [embed.setColor("Green").setDescription(`${member} has been removed from the ticket.`)] })

               data.save()
            })
            break
      }
   },
}
