const { Events } = require("distube")

module.exports = {
   name: Events.SEARCH_NO_RESULT,
   /**
    *
    * @param {import("discord.js").Message} message
    * @param {import("discord.js").Client} client
    */
   async execute(message, query, client) {
      const msg = await message.channel.send({
         embeds: [require("../../utils/embeed")(client, { color: "Red", description: `⛔ | No result found for \`${query}\`!` })],
      })
      setTimeout(() => msg.delete(), 20000)
   },
}
