const { SlashCommandBuilder } = require("discord.js")

module.exports = {
   category: "Music",
   data: new SlashCommandBuilder().setName("queue").setDescription("See the list of songs in the queue!"),

   /**
    *
    * @param {import("discord.js").Interaction} interaction
    * @param {import("discord.js").Client} client
    * @returns
    */
   async execute(interaction, client) {
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

      const q = queue.songs.map((song, i) => `${i === 0 ? "Playing:" : `${i}.`} [${song.name}](${song.url})`).join("\n")

      const tracks = queue.songs.map(
         (song, i) => `**${i + 1}** - [${song.name}](${song.url}) | ${song.formattedDuration}
        Request by: ${song.user}`
      )

      const songs = queue.songs.length
      const nextSongs = songs > 10 ? `And **${songs - 10}** songs...` : `Playlist **${songs}** songs...`

      interaction.reply({
         embeds: [
            require("../../utils/embeed")(client, {
               author: { name: "Queue", iconURL: client.user.displayAvatarURL() },
               description: `${tracks.slice(0, 10).join("\n")}\n\n${nextSongs}`,
               fields: [
                  { name: "> Playing:", value: q, inline: true },
                  { name: "> Total times:", value: `${queue.formattedDuration}`, inline: true },
                  { name: "> Total songs:", value: `${songs}`, inline: true },
               ],
            }),
         ],
         ephemeral: true,
      })
   },
}
