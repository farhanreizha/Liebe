const { Events } = require("distube")

module.exports = {
   name: Events.ERROR,
   /**
    *
    * @param {import("discord.js").Channel} channel
    */
   async execute(channel, err) {
      console.log(channel)
      // if (channel) channel.send(`⛔ | An error encountered: ${err.toString().slice(0, 1974)}`)
      // else console.error(err)
   },
}
