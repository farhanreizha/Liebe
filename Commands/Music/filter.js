const { SlashCommandBuilder } = require("discord.js")

module.exports = {
   category: "Music",
   data: new SlashCommandBuilder()
      .setName("filter")
      .setDescription("Filter the queue")
      .addStringOption((option) =>
         option
            .setName("filter")
            .setDescription("Filter the queue")
            .addChoices(
               { name: "off", value: "off" },
               { name: "3d", value: "3d" },
               { name: "bassboost", value: "bassboost" },
               { name: "echo", value: "echo" },
               { name: "karaoke", value: "karaoke" },
               { name: "nightcore", value: "nightcore" },
               { name: "surround", value: "surround" }
            )
            .setRequired(true)
      ),
   /**
    *
    * @param {import("discord.js").Interaction} interaction
    * @param {import("discord.js").Client} client
    * @returns
    */
   async execute(interaction, client) {
      const filter = interaction.options.getString("filter")
      const voiceChannel = interaction.member.voice.channel
      const queue = await client.distube.getQueue(interaction)

      if (!voiceChannel) {
         return interaction.reply({
            embeds: [
               require("../../utils/embeed")(client, { color: "Red", description: `🚫 | You must be in a voice channel to use this command!` }),
            ],
            ephemeral: true,
         })
      }

      if (queue) {
         if (interaction.guild.members.me.voice.channelId !== interaction.member.voice.channelId) {
            return interaction.reply({
               embeds: [
                  require("../../utils/embeed")(client, { color: "Red", description: `🚫 | You need to be on the same voice channel as the Bot!` }),
               ],
               ephemeral: true,
            })
         }
      }

      if (!queue) {
         return interaction.reply({
            embeds: [require("../../utils/embeed")(client, { color: "Red", description: `🚫 | There are no songs in the playlist!` })],
            ephemeral: true,
         })
      }

      if (filter === "off" && queue.filters.size) queue.filters.clear()
      else if (Object.keys(client.distube.filters).includes(filter)) {
         if (queue.filters.has(filter)) queue.filters.remove(filter)
         else queue.filters.add(filter)
      }
      interaction.reply({
         embeds: [require("../../utils/embeed")(client, { description: `Filters \`${filter}\` have been added to the audio!` })],
         ephemeral: true,
      })
   },
}
