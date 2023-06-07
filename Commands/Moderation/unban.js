const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js")

module.exports = {
   data: new SlashCommandBuilder()
      .setName("unban")
      .setDescription("Unban a user from the discord server.")
      .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
      .addStringOption((option) => option.setName("userid").setDescription("Discord ID of the user you want to unban.").setRequired(true)),
   /**
    *
    * @param {import("discord.js").Interaction} interaction
    */
   async execute(interaction) {
      const { options } = interaction

      const userId = options.getString("userid")

      try {
         await interaction.guild.members.unban(userId)

         const embed = new EmbedBuilder().setDescription(`Successfully unbanned id ${userId} from the guild.`).setColor(0x5fb041).setTimestamp()

         await interaction.reply({ embeds: [embed] })
      } catch (error) {
         console.error(error)

         const errorEmbed = new EmbedBuilder().setDescription("Please provide a valid member's ID.").setColor(0xc72c3b)

         interaction.reply({ embeds: [errorEmbed], ephemeral: true })
      }
   },
}
