const { SlashCommandBuilder } = require("discord.js")

module.exports = {
   category: "Music",
   data: new SlashCommandBuilder()
      .setName("loop")
      .setDescription("Loop the current song!")
      .addStringOption((option) =>
         option
            .setName("option")
            .setDescription("Loop options: off, song, queue")
            .addChoices({ name: "off", value: "off" }, { name: "song", value: "song" }, { name: "queue", value: "queue" })
            .setRequired(true)
      ),

   /**
    *
    * @param {import("discord.js").Interaction} interaction
    * @param {import("discord.js").Client} client
    * @returns
    */
   async execute(interaction, client) {
      const option = interaction.options.getString("option")
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

      let mode = null

      switch (option) {
         case "off":
            mode = 0
            break
         case "song":
            mode = 1
            break
         case "queue":
            mode = 2
            break
      }

      mode = await queue.setRepeatMode(mode)
      mode = mode ? (mode === 2 ? "Repeat queue" : "Repeat song") : "off"
      return interaction.reply({
         embeds: [
            require("../../utils/embeed")(client, {
               author: { name: `Repeat mode`, iconURL: client.user.displayAvatarURL() },
               description: `🔁 | set repeat mode to \`${mode}\``,
            }),
         ],
         ephemeral: true,
      })
   },
}
