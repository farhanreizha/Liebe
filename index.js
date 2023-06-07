const { Client, GatewayIntentBits, Partials, Collection, EmbedBuilder } = require("discord.js")
const { DisTube } = require("distube")
const YoutubePoster = require("discord-youtube")
const logs = require("discord-logs")

const { handleLogs } = require("./Handlers/handleLogs")
const { loadEvents } = require("./Handlers/eventHandler")
const { loadCommands } = require("./Handlers/commandHandler")

const client = new Client({
   intents: [Object.keys(GatewayIntentBits)],
   partials: [Object.keys(Partials)],
})

logs(client, { debug: true })

client.distube = new DisTube(client, {
   leaveOnStop: true,
   leaveOnEmpty: false,
   leaveOnFinish: false,
   emitNewSongOnly: true,
   emitAddSongWhenCreatingQueue: false,
   emitAddListWhenCreatingQueue: false,
})

client.ytp = new YoutubePoster(client, {
   loop_delay_in_min: 1,
})
client.commands = new Collection()
client.config = require("./config.json")

process.on("unhandledRejection", (reason, p) => {
   console.log(reason, p)
})
process.on("uncaughtException", (error, origin) => {
   console.log(error, origin)
})

module.exports = client

handleLogs(client)
loadEvents(client)
loadCommands(client)

client.login(client.config.token)
