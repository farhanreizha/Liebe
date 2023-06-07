const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType } = require("discord.js")
const Logs = require("../../Models/Logs")

module.exports = {
   data: new SlashCommandBuilder()
      .setName("setuplogs")
      .setDescription("Set up your logging channel for the audit logs.")
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
      .addChannelOption((option) =>
         option.setName("channel").setDescription("Channel for logging message.").setRequired(false).addChannelTypes(ChannelType.GuildText)
      ),
   /**
    *
    * @param {import("discord.js").Interaction} interaction
    */
   async execute(interaction) {
      const { channel, guildId, options } = interaction

      const logChannel = options.getChannel("channel") || channel
      const embed = new EmbedBuilder()

      Logs.findOne({ Guild: guildId }).then(async (data, error) => {
         if (!data) {
            await Logs.create({
               Guild: guildId,
               Channel: logChannel.id,
            })
            embed.setDescription("Data was successfully send to the database.").setColor("Green").setTimestamp()
         } else if (data) {
            await Logs.findOneAndDelete({ Guild: guildId })
            await Logs.create({
               Guild: guildId,
               Channel: logChannel.id,
            })
            embed.setDescription("Old data was successfully replaced with the new data.").setColor("Green").setTimestamp()
         }

         if (error) {
            embed.setDescription("Something went wrong. Please contact the developer.").setColor("Red").setTimestamp()
         }

         return interaction.reply({ embeds: [embed], ephemeral: true })
      })
   },
}
