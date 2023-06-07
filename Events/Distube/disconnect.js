const { Events } = require("distube")

module.exports = {
   name: Events.DISCONNECT,
   /**
    *
    * @param {import('distube').Queue} queue
    * @param {import('discord.js').Client} client
    */
   async execute(queue, client) {
      const message = await queue.textChannel.send({
         embeds: [require("../../utils/embeed")(client, { color: "Red", description: `🚫 | The bot has disconnected from the voice channel!` })],
      })
      setTimeout(() => message.delete(), 20000)
   },
}
