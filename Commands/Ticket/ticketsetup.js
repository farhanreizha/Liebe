const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ChannelType } = require("discord.js")
const TicketSetup = require("../../Models/TicketSetup")

module.exports = {
   data: new SlashCommandBuilder()
      .setName("ticketsetup")
      .setDescription("Create a ticket message.")
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
      .addChannelOption((option) =>
         option
            .setName("channel")
            .setDescription("Select the channel where the tickets should be created.")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
      )
      .addChannelOption((option) =>
         option
            .setName("category")
            .setDescription("Select the parent of where the tickets should be created.")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildCategory)
      )
      .addChannelOption((option) =>
         option
            .setName("transcripts")
            .setDescription("Select the channel where the transcripts should be sent.")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
      )
      .addRoleOption((option) => option.setName("handlers").setDescription("Select the ticket handlers role.").setRequired(true))
      .addRoleOption((option) => option.setName("everyone").setDescription("Tag the everyone role.").setRequired(true))
      .addStringOption((option) => option.setName("description").setDescription("Set the description for the ticket embed.").setRequired(true))
      .addStringOption((option) => option.setName("firstbutton").setDescription("Format: (Name of button, emoji)").setRequired(true))
      .addStringOption((option) => option.setName("secondbutton").setDescription("Format: (Name of button, emoji)").setRequired(true))
      .addStringOption((option) => option.setName("thirdbutton").setDescription("Format: (Name of button, emoji)").setRequired(true))
      .addStringOption((option) => option.setName("fourthbutton").setDescription("Format: (Name of button, emoji)").setRequired(true)),

   /**
    *
    * @param {import("discord.js").Interaction} interaction
    */
   async execute(interaction) {
      const { guild, options } = interaction
      try {
         const channel = options.getChannel("channel")
         const category = options.getChannel("category")
         const transcripts = options.getChannel("transcripts")

         const handlers = options.getRole("handlers")
         const everyone = options.getRole("everyone")

         const description = options.getString("description")
         const firstButton = options.getString("firstbutton").split(",")
         const secondButton = options.getString("secondbutton").split(",")
         const thirdButton = options.getString("thirdbutton").split(",")
         const fourthButton = options.getString("fourthbutton").split(",")

         const emoji1 = firstButton[1]
         const emoji2 = secondButton[1]
         const emoji3 = thirdButton[1]
         const emoji4 = fourthButton[1]

         await TicketSetup.findOneAndUpdate(
            { GuildID: guild.id },
            {
               Channel: channel.id,
               Category: category.id,
               Transcripts: transcripts.id,
               Handlers: handlers.id,
               Everyone: everyone.id,
               Description: description,
               Buttons: [firstButton[0], secondButton[0], thirdButton[0], fourthButton[0]],
            },
            { new: true, upsert: true }
         )

         const button = new ActionRowBuilder().setComponents(
            new ButtonBuilder().setCustomId(firstButton[0]).setLabel(firstButton[0]).setStyle(ButtonStyle.Danger).setEmoji(emoji1),
            new ButtonBuilder().setCustomId(secondButton[0]).setLabel(secondButton[0]).setStyle(ButtonStyle.Secondary).setEmoji(emoji2),
            new ButtonBuilder().setCustomId(thirdButton[0]).setLabel(thirdButton[0]).setStyle(ButtonStyle.Primary).setEmoji(emoji3),
            new ButtonBuilder().setCustomId(fourthButton[0]).setLabel(fourthButton[0]).setStyle(ButtonStyle.Success).setEmoji(emoji4)
         )

         const embed = new EmbedBuilder().setDescription(description)

         await guild.channels.cache.get(channel.id).send({
            embeds: [embed],
            components: [button],
         })

         interaction.reply({ content: "Ticket message has been sent.", ephemeral: true })
      } catch (error) {
         console.error(error)
         const errorEmbed = new EmbedBuilder().setDescription("Something went wrong....").setColor("Red")

         return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
      }
   },
}
