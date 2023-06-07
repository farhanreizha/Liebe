const ReactionRole = require("../../Models/ReactionRoles")
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js")

module.exports = {
   data: new SlashCommandBuilder()
      .setName("removerole")
      .setDescription("Remove custom reaction role.")
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
      .addRoleOption((option) => option.setName("role").setDescription("Role to be removed.").setRequired(true)),
   /**
    *
    * @param {import("discord.js").Interaction} interaction
    */
   async execute(interaction) {
      const { options, guildId, member } = interaction

      const role = options.getRole("role")

      try {
         const data = await ReactionRole.findOne({ GuildID: guildId })

         if (!data) return interaction.reply({ content: "This server does not have any data.", ephemeral: true })

         const roles = data.Roles
         const findRole = roles.find((r) => r.roleId === role.id)

         if (!findRole) return interaction.reply({ content: "This role does not exist.", ephemeral: true })
         const filterRoles = roles.filter((r) => r.roleId !== role.id)
         data.Roles = filterRoles

         await data.save()

         return interaction.reply({ content: `Created new role **${role.name}**` })
      } catch (error) {
         console.error(error)
      }
   },
}
