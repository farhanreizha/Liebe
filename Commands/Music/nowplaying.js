const { SlashCommandBuilder } = require("discord.js")
const Format = Intl.NumberFormat()
const status = require("../../utils/status")

module.exports = {
   category: "Music",
   data: new SlashCommandBuilder().setName("nowplaying").setDescription("Show the currently playing song!"),

   /**
    *
    * @param {import("discord.js").Interaction} interaction
    * @param {import("discord.js").Client} client
    * @returns
    */
   async execute(interaction, client) {
      const voiceChannel = interaction.member.voice.channel
      const queue = await client.distube.getQueue(interaction)

      if (!voiceChannel) {
         return interaction.reply({
            embeds: [
               require("../../utils/embeed")(client, { color: "Red", description: `🚫 | You must be in a voice channel to use this command!` }),
            ],
            ephemeral: true,
         })
      }

      if (queue) {
         if (interaction.guild.members.me.voice.channelId !== interaction.member.voice.channelId) {
            return interaction.reply({
               embeds: [
                  require("../../utils/embeed")(client, { color: "Red", description: `🚫 | You need to be on the same voice channel as the Bot!` }),
               ],
               ephemeral: true,
            })
         }
      }

      if (!queue) {
         return interaction.reply({
            embeds: [require("../../utils/embeed")(client, { color: "Red", description: `🚫 | There are no songs in the playlist!` })],
            ephemeral: true,
         })
      }

      const song = queue.songs[0]

      await interaction.reply({
         embeds: [
            require("../../utils/embeed")(client, {
               author: { name: "now playing", image: client.user.avatarURL() },
               color: "Default",
               description: `> [**${song.name}**](${song.url})`,
               thumbnail: song.user.displayAvatarURL(),
               fields: [
                  { name: "🔷 | Status", value: `${status(queue).toString()}`, inline: false },
                  { name: "👀 | Views", value: `${Format.format(song.views)}`, inline: true },
                  { name: "👍 | Likes", value: `${Format.format(song.likes)}`, inline: true },
                  { name: "⏱️ | Time", value: `${song.formattedDuration}`, inline: true },
                  { name: "🎵 | Upload", value: `[${song.uploader.name}](${song.uploader.url})`, inline: true },
                  { name: "👌 | Request by", value: `${song.user}`, inline: true },
                  {
                     name: "📻 | Play music at",
                     value: ` ┕🔊 | ${client.channels.cache.get(queue.voiceChannel.id)} ┕🪄 | ${queue.voiceChannel.bitrate / 1000}  kbps`,
                     inline: false,
                  },
                  {
                     name: "🤖 | Suggestions",
                     value: `[${song.related[0].name}](${song.related[0].url}) ┕⌛ | Time: ${song.related[0].formattedDuration} | 🆙 | Uploaded with: [${song.related[0].uploader.name}](${song.related[0].uploader.url})`,
                     inline: false,
                  },
               ],
               image: song.thumbnail,
               footer: { name: `${Format.format(queue.songs.length)} songs in queue`, image: `${client.user.displayAvatarURL()}` },
            }),
         ],
         ephemeral: true,
      })
   },
}
