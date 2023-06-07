const { SlashCommandBuilder } = require("discord.js")

module.exports = {
   category: "Music",
   data: new SlashCommandBuilder()
      .setName("rewind")
      .setDescription("Rewind seconds in a song.")
      .addIntegerOption((option) =>
         option.setName("seconds").setDescription("Amount of seconds to rewind. (10 = 10%)").setMinValue(0).setRequired(true)
      ),

   /**
    *
    * @param {import("discord.js").Interaction} interaction
    * @param {import("discord.js").Client} client
    * @returns
    */
   async execute(interaction, client) {
      const voiceChannel = interaction.member.voice.channel
      const seconds = interaction.options.getInteger("seconds")
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

      queue.seek(queue.currentTime - seconds)
      await interaction.reply({ embeds: [require("../../utils/embeed")(client, { description: `Rewind the song \`${seconds}s\`.` })] })
   },
}
