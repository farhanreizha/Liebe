const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require("discord.js")
const Welcome = require("../../Models/Welcome")

module.exports = {
   data: new SlashCommandBuilder()
      .setName("setupwelcome")
      .setDescription("Setup your welcome message for the discord bot.")
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
      .addChannelOption((option) =>
         option.setName("channel").setDescription("Channel for welcome messages.").setRequired(true).addChannelTypes(ChannelType.GuildText)
      )
      .addStringOption((option) => option.setName("welcome-message").setDescription("Enter your welcome message.").setRequired(true))
      .addRoleOption((option) => option.setName("welcome-role").setDescription("Enter your welcome role.").setRequired(false)),
   /**
    *
    * @param {import("discord.js").Interaction} interaction
    */
   async execute(interaction) {
      const { options } = interaction

      const welcomeChannel = options.getChannel("channel")
      const welcomeMessage = options.getString("welcome-message")
      const roleId = options.getRole("welcome-role")

      if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.SendMessages)) {
         interaction.reply({ content: "I don't have permissions for this.", ephemeral: true })
      }

      await Welcome.findOne({ Guild: interaction.guild.id }).then(async (data, error) => {
         if (!data) {
            await Welcome.create({
               Guild: interaction.guild.id,
               Channel: welcomeChannel.id,
               Message: welcomeMessage,
               Role: roleId.id,
            })
            interaction.reply({ content: "Successfully created a welcome message.", ephemeral: true })
         } else {
            interaction.reply({ content: "Welcome message was created.", ephemeral: true })
         }
      })
   },
}
