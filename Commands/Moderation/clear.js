const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js")

module.exports = {
   data: new SlashCommandBuilder()
      .setName("clear")
      .setDescription("Clear a specific amount of messages from a target or channel.")
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
      .addIntegerOption((option) => option.setName("amount").setDescription("Amount of messages to clear.").setMinValue(0).setRequired(true))
      .addUserOption((option) => option.setName("target").setDescription("Select a target to clear their messages.").setRequired(false)),
   /**
    *
    * @param {import("discord.js").Interaction} interaction
    */
   async execute(interaction) {
      const { channel, options } = interaction

      const amount = options.getInteger("amount")
      const target = options.getUser("target")

      const messages = await channel.messages.fetch({
         limit: amount + 1,
      })

      const res = new EmbedBuilder().setColor(0x5fb041)

      if (target) {
         let i = 0
         const filtered = []

         ;(await messages).filter((message) => {
            if (message.author.id === target.id && amount > i) {
               filtered.push(message)
               i++
            }
         })

         await channel.bulkDelete(filtered).then((messages) => {
            res.setDescription(`Successfully deleted ${messages.size} messages from ${target}.`)
            interaction.reply({ embeds: [res], ephemeral: true })
         })
      } else {
         await channel.bulkDelete(amount, true).then((messages) => {
            res.setDescription(`Successfully deleted ${messages.size} messages from channel.`)
            interaction.reply({ embeds: [res], ephemeral: true })
         })
      }
   },
}
