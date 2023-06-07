const { Client } = require("discord.js")

/**
 *
 * @param {Client} client
 */
function loadEvents(client) {
   const ascii = require("ascii-table")
   const fs = require("fs")
   const table = new ascii().setHeading("Event", "Status")

   const folders = fs.readdirSync("./Events")
   for (const folder of folders) {
      const files = fs.readdirSync(`./Events/${folder}`).filter((file) => file.endsWith(".js"))

      for (const file of files) {
         const event = require(`../Events/${folder}/${file}`)
         if (event.rest) {
            if (event.once) client.rest.once(event.name, (...arguments) => event.execute(...arguments, client))
            else client.rest.on(event.name, (...arguments) => event.execute(...arguments, client))
         } else {
            if (event.once) client.once(event.name, (...arguments) => event.execute(...arguments, client))
            else {
               client.distube.on(event.name, (...arguments) => event.execute(...arguments, client))
               client.on(event.name, (...arguments) => event.execute(...arguments, client))
            }
         }

         table.addRow(file, "✅")
         continue
      }
   }

   return console.log(table.toString(), "\nLoaded events")
}

module.exports = { loadEvents }
