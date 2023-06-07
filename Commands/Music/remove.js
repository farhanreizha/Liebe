const { SlashCommandBuilder } = require("discord.js")

module.exports = {
   category: "Music",
   data: new SlashCommandBuilder()
      .setName("remove")
      .setDescription("Remove song!")
      .addNumberOption((option) => option.setName("id").setDescription("ID").setRequired(true).setAutocomplete(true)),

   /**
    *
    * @param {import("discord.js").Interaction} interaction
    * @param {import("discord.js").Client} client
    * @returns
    */
   async execute(interaction, client) {
      try {
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
                     require("../../utils/embeed")(client, {
                        color: "Red",
                        description: `🚫 | You need to be on the same voice channel as the Bot!`,
                     }),
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

         const id = interaction.options.getNumber("id")
         // let track = queue.songs[args[0]];
         let song = queue.songs.splice(id - 1, 1)
         const msg = await queue.textChannel.send({
            embeds: [
               require("../../utils/embeed")(client, {
                  author: { name: "Removed song", iconURL: client.user.displayAvatarURL() },
                  description: `🎵 | Removed ${song[0].name} from the playlist!`,
               }),
            ],
         })
         setTimeout(() => {
            msg.delete()
         }, 5000)
      } catch (err) {
         console.log(err)
         await interaction.reply({
            embeds: [
               require("../../utils/embeed")(client, {
                  color: "Red",
                  author: { name: "Error", iconURL: client.user.displayAvatarURL() },
                  description: `🚫 | Error!\n\`\`\`${err}\`\`\``,
               }),
            ],
            ephemeral: true,
         })
      }
   },

   /**
    *
    * @param {import("discord.js").Interaction} interaction
    * @param {import("discord.js").Client} client
    * @returns
    */
   async autocomplete(interaction, client) {
      const focusedValue = interaction.options.getFocused()
      const queue = await client.distube.getQueue(interaction)

      if (queue.songs.length > 25) {
         const tracks = queue.songs
            .map((song, i) => {
               return { name: `${i + 1}. ${song.name}`, value: i + 1 }
            })
            .slice(0, 25)
         const filtered = tracks.filter((track) => track.name.startsWith(focusedValue))
         await interaction.respond(filtered)
      } else {
         const tracks = queue.songs
            .map((song, i) => {
               return { name: `${i + 1}. ${song.name}`, value: i + 1 }
            })
            .slice(0, queue.songs.length)
         const filtered = tracks.filter((track) => track.name.startsWith(focusedValue))
         await interaction.respond(filtered)
      }
   },
}
