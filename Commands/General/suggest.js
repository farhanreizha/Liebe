const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, PermissionFlagsBits, ButtonStyle, ChannelType } = require("discord.js")
const Suggestion = require("../../Models/Suggestion")

module.exports = {
   data: new SlashCommandBuilder()
      .setName("suggest")
      .setDescription("Place a suggestion.")
      .addStringOption((option) =>
         option
            .setName("type")
            .setDescription("Select an option.")
            .setRequired(true)
            .addChoices(
               { name: "Youtube Video", value: "Youtube" },
               { name: "Discord", value: "Discord" },
               { name: "Patreon", value: "Patreon" },
               { name: "Services", value: "Services" },
               { name: "Other", value: "Other" }
            )
      )
      .addStringOption((option) => option.setName("description").setDescription("Describe your suggestion clearly.").setRequired(true))
      .addChannelOption((option) =>
         option.setName("channel").setDescription("Select your channel for suggestion.").setRequired(false).addChannelTypes(ChannelType.GuildText)
      ),
   /**
    *
    * @param {import("discord.js").Interaction} interaction
    */
   async execute(interaction) {
      const { guild, options, member, guildId, user } = interaction

      const type = options.getString("type")
      const description = options.getString("description")
      const getChannel = options.getChannel("channel") || interaction.channel

      const channel = guild.channels.cache.get(getChannel.id)

      const embed = new EmbedBuilder()
         .setColor("Orange")
         .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) })
         .addFields(
            { name: "Type", value: type, inline: true },
            { name: "Suggestion", value: description, inline: true },
            { name: "Status", value: "Pending", inline: true }
         )
         .setTimestamp()

      const button = new ActionRowBuilder().addComponents(
         new ButtonBuilder().setCustomId("suggest-accept").setLabel("✅ Accept").setStyle(ButtonStyle.Success),
         new ButtonBuilder().setCustomId("suggest-decline").setLabel("⛔ Decline").setStyle(ButtonStyle.Danger)
      )

      try {
         const message = await channel.send({ embeds: [embed], components: [button], fetchReply: true })

         await channel.send({ content: "Use ``/suggest`` in the bot-commands channel to submit your suggestion." })
         await interaction.reply({ content: "Suggestion was successfully sent to the channel.", ephemeral: true })
         await Suggestion.create({ GuildID: guildId, MessageID: message.id, Details: [{ MemberID: member.id, Type: type, Suggestion: description }] })
      } catch (error) {
         console.error(error)
      }
   },
}
