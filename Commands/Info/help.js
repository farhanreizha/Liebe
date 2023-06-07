const { ComponentType, EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js")

module.exports = {
   data: new SlashCommandBuilder().setName("help").setDescription("Get a list of all the commands from the discord bot."),
   /**
    *
    * @param {import("discord.js").Interaction} interaction
    */
   async execute(interaction) {
      const emojis = {
         info: "📄",
         moderation: "🛠",
         general: "⚙",
         ticket: "🎟",
      }

      const directories = [...new Set(interaction.client.commands.map((command) => command.folder))]

      const formatString = (string) => `${string[0].toUpperCase()}${string.slice(1).toLowerCase()}`

      const categories = directories.map((directory) => {
         const getCommands = interaction.client.commands
            .filter((command) => command.folder === directory)
            .map((command) => {
               return { name: command.data.name, description: command.data.description || "There is no description for this command." }
            })
         return {
            directory: formatString(directory),
            command: getCommands,
         }
      })
      const embed = new EmbedBuilder().setDescription("Please choose a category in the dropdown menu")

      const components = (state) => [
         new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
               .setCustomId("help-menu")
               .setPlaceholder("Please select a category")
               .setDisabled(state)
               .setOptions(
                  categories.map((command) => {
                     return {
                        label: command.directory,
                        value: command.directory.toLowerCase(),
                        description: `Commands from ${command.directory} category.`,
                        emoji: emojis[command.directory.toLowerCase() || null],
                     }
                  })
               )
         ),
      ]
      const initialMessage = await interaction.reply({ embeds: [embed], components: components(false) })

      const filter = (interaction) => interaction.user.id === interaction.member.id

      const collector = interaction.channel.createMessageComponentCollector({
         filter,
         componentType: ComponentType.SelectMenu,
      })

      collector.on("collect", (interaction) => {
         const [directory] = interaction.values
         const category = categories.find((x) => x.directory.toLowerCase() === directory)

         const categoryEmbed = new EmbedBuilder()
            .setTitle(`${formatString(directory)} commands`)
            .setDescription(`A list of all the commands categorized under ${directory}`)
            .addFields(
               category.command.map((command) => {
                  return {
                     name: `\`${command.name}\``,
                     value: command.description,
                     inline: true,
                  }
               })
            )

         interaction.update({ embeds: [categoryEmbed] })
      })

      collector.on("end", () => {
         initialMessage.edit({ components: components(true) })
      })
   },
}
