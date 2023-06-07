const { Events } = require("distube")
const status = require("../../utils/status")

module.exports = {
   name: Events.PLAY_SONG,
   /**
    *
    * @param {import("distube").Queue} queue
    * @param {import("distube").Song} song
    * @param {import("discord.js").Client} client
    */
   async execute(queue, song, client) {
      const Format = Intl.NumberFormat()

      const message = await queue.textChannel.send({
         embeds: [
            require("../../utils/embeed")(client, {
               author: { name: "now playing", image: client.user.avatarURL() },
               color: "Default",
               description: `> [**${song.name}**](${song.url})`,
               thumbnail: song.user.displayAvatarURL(),
               fields: [
                  {
                     name: "🔷 | Status",
                     value: `${status(queue).toString()}`,
                     inline: false,
                  },
                  {
                     name: "👀 | Views",
                     value: `${Format.format(song.views)}`,
                     inline: true,
                  },
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
               footer: {
                  name: `${Format.format(queue.songs.length)} songs in queue`,
                  image: `${client.user.displayAvatarURL()}`,
               },
            }),
         ],
      })

      setTimeout(() => message.delete(), 1000 * 60 * 3)
   },
}
