const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js")

module.exports = {
   data: new SlashCommandBuilder()
      .setName("ban")
      .setDescription("Ban a user from the discord server.")
      .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
      .addUserOption((option) => option.setName("target").setDescription("Select the user you wish to banned.").setRequired(true))
      .addStringOption((option) => option.setName("reason").setDescription("Reason for the ban.")),
   /**
    *
    * @param {import("discord.js").Interaction} interaction
    */
   async execute(interaction) {
      const { options } = interaction

      const user = options.getUser("target")
      const reason = options.getString("reason") || "No reason provided"

      const member = await interaction.guild.members.fetch(user.id)

      const errorEmbed = new EmbedBuilder()
         .setDescription(`You can't take action on ${user.username} since they have a higher role.`)
         .setColor(0xc72c3b)

      if (member.roles.highest.position >= interaction.member.roles.highest.position)
         return interaction.reply({ embeds: [errorEmbed], ephemeral: true })

      await member.ban({ reason })

      const embed = new EmbedBuilder().setDescription(`Successfully banned ${user} with reason: ${reason}`).setColor(0x5fb041)

      await interaction.reply({ embeds: [embed] })
   },
}
