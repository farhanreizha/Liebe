const { Events } = require("distube")

module.exports = {
   name: Events.FINISH,
   /**
    *
    * @param {import('distube').Queue} queue
    * @param {import('discord.js').Client} client
    */
   async execute(queue, client) {
      const message = await queue.textChannel.send({
         embeds: [require("../../utils/embeed")(client, { color: "Green", description: "🏁 | Queue finished!" })],
      })
      setTimeout(() => message.delete(), 20000)
   },
}
