const { Client, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType } = require("discord.js")

module.exports = {
   data: new SlashCommandBuilder()
      .setName("youtube")
      .setDescription("Manage and receive notification from YouTube channels.")
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
      .addSubcommand((subcommand) =>
         subcommand
            .setName("add")
            .setDescription("Add a channel to receive new YouTube video notification.")
            .addStringOption((option) =>
               option.setName("link").setDescription("The link of the channel you want to receive notifications from.").setRequired(true)
            )
            .addChannelOption((option) =>
               option
                  .setName("channel")
                  .setDescription("The channel you wish to send the notifications to.")
                  .setRequired(false)
                  .addChannelTypes(ChannelType.GuildText)
            )
      )
      .addSubcommand((subcommand) =>
         subcommand
            .setName("remove")
            .setDescription("Remove an registered channel from the notification list.")
            .addStringOption((option) =>
               option.setName("link").setDescription("The link of the channel you want to stop receiving notifications from.").setRequired(true)
            )
      )
      .addSubcommand((subcommand) => subcommand.setName("removeall").setDescription("Remove all registered channel from the notification list."))
      .addSubcommand((subcommand) =>
         subcommand
            .setName("latestvideo")
            .setDescription("Get the latest video from a channel.")
            .addStringOption((option) =>
               option.setName("link").setDescription("The link of the channel you want to see latest video.").setRequired(true)
            )
      )
      .addSubcommand((subcommand) =>
         subcommand
            .setName("info")
            .setDescription("Get information about a channel.")
            .addStringOption((option) =>
               option.setName("link").setDescription("The link of the channel you want to see information about channel.").setRequired(true)
            )
      ),
   /**
    *
    * @param {import("discord.js").Interaction} interaction
    * @param {Client} client
    */
   async execute(interaction, client) {
      const { options, guildId } = interaction

      const sub = options.getSubcommand(["add", "remove", "removeall", "latestvideo", "info"])
      const link = options.getString("link")
      const channel = options.getChannel("channel") || interaction.channel

      const embed = new EmbedBuilder()

      try {
         switch (sub) {
            case "add":
               client.ytp
                  .setChannel(link, channel)
                  .then((data) => {
                     interaction.reply({
                        embeds: [
                           embed
                              .setColor("Green")
                              .setDescription(`✅ | Successfully added new channel ${data.YTchannel} to ${channel}`)
                              .setTimestamp(),
                        ],
                     })
                  })
                  .catch((error) => {
                     console.error(error)
                     return interaction.reply({ embeds: [embed.setColor("Red").setDescription("Something went wrong. Please contact developers.")] })
                  })
               break
            case "remove":
               client.ytp
                  .deleteChannel(guildId, link)
                  .then((data) => {
                     interaction.reply({
                        embeds: [
                           embed.setColor("Green").setDescription(`✅ | Successfully removed channel ${channel} from ${guildId}`).setTimestamp(),
                        ],
                     })
                  })
                  .catch((error) => {
                     console.error(error)
                     return interaction.reply({ embeds: [embed.setColor("Red").setDescription("Something went wrong. Please contact developers.")] })
                  })
               break
            case "removeall":
               client.ytp
                  .deleteAllChannels(guildId)
                  .then(() => {
                     interaction.reply({
                        embeds: [embed.setColor("Green").setDescription(`✅ | Successfully deleted all channel in ${guildId}`).setTimestamp()],
                     })
                  })
                  .catch((error) => {
                     console.error(error)
                     return interaction.reply({ embeds: [embed.setColor("Red").setDescription("Something went wrong. Please contact developers.")] })
                  })
               break
            case "latestvideo":
               client.ytp
                  .getLatestVideos(link)
                  .then((data) => {
                     embed.setTitle(`${data[0].title}`).setURL(data[0].link)
                     interaction.reply({ embeds: [embed] })
                     return interaction.channel.send({ content: `${data[0].link}` })
                  })
                  .catch((error) => {
                     console.error(error)
                     return interaction.reply({ embeds: [embed.setColor("Red").setDescription("Something went wrong. Please contact developers.")] })
                  })
               break
            case "info":
               client.ytp
                  .getChannelInfo(link)
                  .then((data) => {
                     embed
                        .setTitle(data.name)
                        .addFields(
                           { name: "URL", value: `${data.url}`, inline: true },
                           { name: "Subscriber", value: `${data.subscribers.split(" ")[0]}`, inline: true },
                           { name: "Description", value: `${data.description}`, inline: false }
                        )
                        .setImage(data.banner[0].url)
                        .setTimestamp()
                     interaction.reply({ embeds: [embed] })
                  })
                  .catch((error) => {
                     console.error(error)
                     return interaction.reply({ embeds: [embed.setColor("Red").setDescription("Something went wrong. Please contact developers.")] })
                  })
               break
         }
      } catch (error) {
         console.error(error)
         return interaction.reply({ embeds: [embed.setColor("Red").setDescription("Something went wrong. Please contact developers.")] })
      }
   },
}
