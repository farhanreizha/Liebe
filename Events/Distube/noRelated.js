const { Events } = require("distube")

module.exports = {
   name: Events.NO_RELATED,
   /**
    *
    * @param {import('distube').Queue} queue
    * @param {import('discord.js').Client} client
    */
   async execute(queue, client) {
      const message = await queue.textChannel.send({
         embeds: [require("../../utils/embeed")(client, { color: "Red", description: `🚫 | Song not found!` })],
      })
      setTimeout(() => message.delete(), 20000)
   },
}
