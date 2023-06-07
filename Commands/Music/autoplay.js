const { SlashCommandBuilder } = require("discord.js")

module.exports = {
   category: "Music",
   data: new SlashCommandBuilder().setName("autoplay").setDescription("Toggle autoplay music in guild."),

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

      if (!queue.autoplay) {
         await client.distube.toggleAutoplay(interaction)
         await interaction.reply({
            embeds: [require("../../utils/embeed")(client, { description: `\`📻\` | *Autoplay has been:* \`Activated\`` })],
            ephemeral: true,
         })
      } else {
         await client.distube.toggleAutoplay(interaction)
         await interaction.reply({
            embeds: [require("../../utils/embeed")(client, { description: `\`📻\` | *Autoplay has been:* \`Deactivated\`` })],
            ephemeral: true,
         })
      }
   },
}
