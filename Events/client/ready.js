const { Client } = require("discord.js")
const mongoose = require("mongoose")
const Levels = require("discord.js-leveling")

module.exports = {
   name: "ready",
   once: true,
   /**
    *
    * @param {Client} client
    */
   async execute(client) {
      await mongoose.connect(client.config.mongodb || "")

      if (mongoose.connect) {
         console.log("Mongodb connection successful.")
      }

      Levels.setURL(client.config.mongodb)

      console.log(`${client.user.tag} is Online`)
   },
}
