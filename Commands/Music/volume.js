const { SlashCommandBuilder } = require("discord.js")

module.exports = {
   category: "Music",
   data: new SlashCommandBuilder()
      .setName("volume")
      .setDescription("Change the volume of the currently playing song (0-200)!")
      .addIntegerOption((option) => option.setName("volume").setDescription("10 = 10%").setMaxValue(200).setMinValue(0).setRequired(true)),

   /**
    *
    * @param {import("discord.js").Interaction} interaction
    * @param {import("discord.js").Client} client
    * @returns
    */
   async execute(interaction, client) {
      const volume = interaction.options.getInteger("volume")
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

      queue.setVolume(voiceChannel, volume)
      await interaction.reply({
         embeds: [require("../../utils/embeed")(client, { description: `✅ | The volume has been changed to: ${volume}%/200%` })],
         ephemeral: true,
      })
   },
}
