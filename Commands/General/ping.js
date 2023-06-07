const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js")

module.exports = {
   data: new SlashCommandBuilder().setName("ping").setDescription("Replied pong!").setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
   /**
    *
    * @param {import("discord.js").Interaction} interaction
    */
   async execute(interaction) {
      interaction.reply({ content: "Pong!", ephemeral: true })
   },
}
