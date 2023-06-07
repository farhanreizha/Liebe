const { Events } = require("distube")
const status = require("../../utils/status")

module.exports = {
   name: Events.ADD_LIST,
   /**
    *
    * @param {import("distube").Queue} queue
    * @param {import("distube").Song} song
    * @param {import("discord.js").Client} client
    */
   async execute(queue, song, client) {
      const message = await queue.textChannel.send({
         embeds: [
            require("../../utils/embeed")(client, {
               color: "Green",
               description: `🎶 | Added \`${playlist.name}\` playlist (${playlist.songs.length} songs) to queue\n${status(queue)}`,
            }),
         ],
      })
      setTimeout(() => message.delete(), 20000)
   },
}
