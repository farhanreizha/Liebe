const { EmbedBuilder, GuildMember } = require("discord.js")
const Welcome = require("../../Models/Welcome")

module.exports = {
   name: "guildMemberAdd",
   /**
    *
    * @param {GuildMember} member
    */
   async execute(member) {
      await Welcome.findOne({ Guild: member.guild.id }).then(async (data, error) => {
         if (!data) return

         let channel = data.Channel
         let message = data.Message || " "
         let role = data.Role
         const { user, guild } = member
         const welcomeChannel = member.guild.channels.cache.get(channel)
         const welcomeEmbed = new EmbedBuilder()
            .setTitle(`**${user.username}**`)
            .setDescription(`${message} <@${member.id}>`)
            .setColor(0x037821)
            .setThumbnail(user.avatarURL())
            .addFields({ name: "Total member", value: `${guild.memberCount}` })
            .setTimestamp()
         welcomeChannel.send({ embeds: [welcomeEmbed] })
         member.roles.add(role)
      })
   },
}
