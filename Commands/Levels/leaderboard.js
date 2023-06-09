const { Client, SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const Levels = require("discord.js-leveling")

module.exports = {
   data: new SlashCommandBuilder().setName("leaderboard").setDescription("Get the leaderboard from the rank system."),
   /**
    *
    * @param {import("discord.js").Interaction} interaction
    * @param {Client} client
    */
   async execute(interaction, client) {
      const { guildId } = interaction

      const rawLeaderboard = await Levels.fetchLeaderboard(guildId, 10)

      if (rawLeaderboard.length < 1) return interaction.reply({ content: "Nobody's in the leaderboard yet.", ephemeral: true })

      const embed = new EmbedBuilder()

      const leaderboard = await Levels.computeLeaderboard(client, rawLeaderboard, true)

      const lb = leaderboard.map(
         (e) => `**${e.position}.** ${e.username}#${e.discriminator}\n**Level:** ${e.level}\n**XP:** ${e.xp.toLocaleString()}`
      )

      embed.setTitle("leaderboard").setDescription(lb.join("\n\n")).setTimestamp()

      return interaction.reply({ embeds: [embed] })
   },
}
