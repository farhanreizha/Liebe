const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js")
const ms = require("ms")

module.exports = {
   data: new SlashCommandBuilder()
      .setName("mute")
      .setDescription("Mute a user from the guild.")
      .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
      .addUserOption((option) => option.setName("target").setDescription("Select the user you wish to mute.").setRequired(true))
      .addStringOption((option) => option.setName("time").setDescription("How long should the mute last?").setRequired(true))
      .addStringOption((option) => option.setName("reason").setDescription("What is the reason of the mute?")),
   /**
    *
    * @param {import("discord.js").Interaction} interaction
    */
   async execute(interaction) {
      const { guild, options } = interaction

      const user = options.getUser("target")
      const member = guild.members.cache.get(user.id)
      const time = options.getString("time")
      const convertedTime = ms(time)
      const reason = options.getString("reason") || "No reason provided"

      const errorEmbed = new EmbedBuilder().setDescription("Something went wrong. Please try again later.").setColor(0xc72c3b)

      const successEmbed = new EmbedBuilder()
         .setTitle("**:white_check_mark: Muted**")
         .setDescription(`Successfully muted ${user}`)
         .addFields({ name: "Reason", value: reason, inline: true }, { name: "Duration", value: time, inline: true })
         .setColor(0x5fb041)
         .setTimestamp()

      if (member.roles.highest.position >= interaction.member.roles.highest.position)
         return interaction.reply({ embeds: [errorEmbed], ephemeral: true })

      if (!guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers)) return interaction.reply({ embeds: [errorEmbed], ephemeral: true })

      if (!convertedTime) return interaction.reply({ embeds: [errorEmbed], ephemeral: true })

      try {
         await member.timeout(convertedTime, reason)
         interaction.reply({ embeds: [successEmbed], ephemeral: true })
      } catch (error) {
         console.error(error)
      }
   },
}
