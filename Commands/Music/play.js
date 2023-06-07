const { SlashCommandBuilder } = require("discord.js")
const ytsr = require("@distube/ytsr")

module.exports = {
   category: "Music",
   data: new SlashCommandBuilder()
      .setName("play")
      .setDescription("Play a song")
      .addStringOption((option) => option.setName("query").setDescription("The keyword or URL of the song to play").setRequired(true)),

   /**
    *
    * @param {import('discord.js').Interaction} interaction
    * @param {import("discord.js").Client} client
    * @returns
    */
   async execute(interaction, client) {
      const query = interaction.options.getString("query")

      const voiceChannel = interaction.member.voice.channel
      const queue = await client.distube.getQueue(voiceChannel)

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

      await interaction.reply({
         embeds: [require("../../utils/embeed")(client, { description: "🔍 | Looking for a song..." })],
         ephemeral: true,
      })

      client.distube.play(voiceChannel, query, {
         textChannel: interaction.channel,
         member: interaction.member,
      })

      await interaction.editReply({
         embeds: [require("../../utils/embeed")(client, { description: "🔍 | Successful search!" })],
         ephemeral: true,
      })
   },
}
