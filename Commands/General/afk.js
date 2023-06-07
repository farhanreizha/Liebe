const { SlashCommandBuilder } = require("discord.js")
const AFK = require("../../Models/Afk")

module.exports = {
   data: new SlashCommandBuilder().setName("afk").setDescription("Toggle for your afk status."),
   /**
    *
    * @param {import("discord.js").Interaction} interaction
    */
   async execute(interaction) {
      const { guildId, user } = interaction

      AFK.findOne({ GuildID: guildId, UserID: user.id }).then(async (data, error) => {
         try {
            if (!data) {
               await AFK.create({
                  GuildID: guildId,
                  UserID: user.id,
                  Afk: true,
               })
            } else if (data.Afk) {
               data.Afk = false
               data.save()
               return interaction.reply({ content: "You are **not** afk anymore.", ephemeral: true })
            } else {
               data.Afk = true
               data.save()
            }
            return interaction.reply({ content: "You are now **afk**.", ephemeral: true })
         } catch (error) {
            console.error(error)
         }
      })
   },
}
