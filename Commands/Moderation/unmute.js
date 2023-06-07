const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js")
const ms = require("ms")

module.exports = {
   data: new SlashCommandBuilder()
      .setName("unmute")
      .setDescription("Unmute a user from the guild.")
      .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
      .addUserOption((option) => option.setName("target").setDescription("Select the user you wish to unmute.").setRequired(true)),
   /**
    *
    * @param {import("discord.js").Interaction} interaction
    */
   async execute(interaction) {
      const { guild, options } = interaction

      const user = options.getUser("target")
      const member = guild.members.cache.get(user.id)

      const errorEmbed = new EmbedBuilder().setDescription("Something went wrong. Please try again later.").setColor(0xc72c3b)

      const successEmbed = new EmbedBuilder()
         .setTitle("**:white_check_mark: Unmuted**")
         .setDescription(`Successfully unmuted ${user}`)
         .setColor(0x5fb041)
         .setTimestamp()

      if (member.roles.highest.position >= interaction.member.roles.highest.position)
         return interaction.reply({ embeds: [errorEmbed], ephemeral: true })

      if (!guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers)) return interaction.reply({ embeds: [errorEmbed], ephemeral: true })

      try {
         await member.timeout(null)
         interaction.reply({ embeds: [successEmbed], ephemeral: true })
      } catch (error) {
         console.error(error)
      }
   },
}
