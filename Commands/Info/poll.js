const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType } = require("discord.js")

module.exports = {
   data: new SlashCommandBuilder()
      .setName("poll")
      .setDescription("Create a poll and send it to a certain channel.")
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
      .addStringOption((option) => option.setName("description").setDescription("Describe the poll.").setRequired(true))
      .addChannelOption((option) =>
         option.setName("channel").setDescription("Where do you want to send the poll to?").setRequired(true).addChannelTypes(ChannelType.GuildText)
      ),
   /**
    *
    * @param {import("discord.js").Interaction} interaction
    */
   async execute(interaction) {
      const { options } = interaction

      const description = options.getString("description")
      const channel = options.getChannel("channel")

      const embed = new EmbedBuilder().setColor("Gold").setDescription(description).setTimestamp()

      try {
         const m = await channel.send({ embeds: [embed] })
         await m.react("✅")
         await m.react("❌")
         await interaction.reply({ content: "Poll was successfully sent to the channel.", ephemeral: true })
      } catch (error) {
         console.error(error)
      }
   },
}
