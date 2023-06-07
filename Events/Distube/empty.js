const { Events } = require("distube")

module.exports = {
   name: Events.EMPTY,
   /**
    *
    * @param {import("discord.js").Channel} channel
    * @param {import("discord.js").Client} client
    */
   async execute(channel, client) {
      const message = await channel.send({
         embeds: [require("../../utils/embeed")(client, { color: "Red", description: "⛔ |Voice channel is empty! Leaving the channel..." })],
      })
      setTimeout(() => message.delete(), 20000)
   },
}
