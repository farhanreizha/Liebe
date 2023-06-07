const { Client, SlashCommandBuilder, PermissionFlagsBits, ActivityType, EmbedBuilder } = require("discord.js")

module.exports = {
   data: new SlashCommandBuilder()
      .setName("update")
      .setDescription("Update the bot presences")
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
      .addSubcommand((subcommand) =>
         subcommand
            .setName("activity")
            .setDescription("Update the bots activity.")
            .addStringOption((option) =>
               option
                  .setName("type")
                  .setDescription("Pick an activity.")
                  .setRequired(true)
                  .addChoices(
                     { name: "Playing", value: "Playing" },
                     { name: "Streaming", value: "Streaming" },
                     { name: "Listening", value: "Listening" },
                     { name: "Watching", value: "Watching" },
                     { name: "Competing", value: "Competing" }
                  )
            )
            .addStringOption((option) => option.setName("activity").setDescription("Set your current activity.").setRequired(true))
      )
      .addSubcommand((subcommand) =>
         subcommand
            .setName("status")
            .setDescription("Update the bots status.")
            .addStringOption((option) =>
               option
                  .setName("type")
                  .setDescription("Pick a status.")
                  .setRequired(true)
                  .addChoices(
                     { name: "Online", value: "online" },
                     { name: "Idle", value: "idle" },
                     { name: "Do not disturb", value: "dnd" },
                     { name: "Invisible", value: "invisible" }
                  )
            )
      ),
   /**
    *
    * @param {import("discord.js").Interaction} interaction
    * @param {Client} client
    */
   async execute(interaction, client) {
      const { options } = interaction

      const sub = options.getSubcommand(["activity", "status"])
      const type = options.getString("type")
      const activity = options.getString("activity")

      try {
         switch (sub) {
            case "activity":
               switch (type) {
                  case "Playing":
                     client.user.setActivity(activity, { type: ActivityType.Playing })
                     break
                  case "Streaming":
                     client.user.setActivity(activity, { type: ActivityType.Streaming })
                     break
                  case "Listening":
                     client.user.setActivity(activity, { type: ActivityType.Listening })
                     break
                  case "Watching":
                     client.user.setActivity(activity, { type: ActivityType.Watching })
                     break
                  case "Competing":
                     client.user.setActivity(activity, { type: ActivityType.Competing })
                     break
               }
               break
            case "status":
               client.user.setPresence({ status: type })
               break
         }
      } catch (error) {
         console.error(error)
      }

      const embed = new EmbedBuilder()

      return interaction.reply({ embeds: [embed.setDescription(`Successfully updated your ${sub} to **${type}**.`)] })
   },
}
