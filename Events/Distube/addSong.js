const { Events } = require("distube")

module.exports = {
   name: Events.ADD_SONG,
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
               description: `🎶 | Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`,
            }),
         ],
      })
      setTimeout(() => message.delete(), 20000)
   },
}
