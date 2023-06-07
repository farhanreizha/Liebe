const { EmbedBuilder } = require("discord.js")
const config = require("../config.json")

module.exports = (client, embeedJson) => {
   const { title, author, thumbnail, description, image, fields, color, footer } = embeedJson

   const makeEmbeed = new EmbedBuilder()

   if (author) makeEmbeed.setAuthor({ name: author.name, iconURL: author.image })
   if (title) makeEmbeed.setTitle(title)
   if (thumbnail) makeEmbeed.setThumbnail(thumbnail)
   if (description) makeEmbeed.setDescription(description)
   if (image) makeEmbeed.setImage(image)
   if (fields) makeEmbeed.setFields(fields)

   if (footer) makeEmbeed.setFooter({ text: footer.name, iconURL: footer.image })
   if (!footer) makeEmbeed.setFooter({ text: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })

   if (color) makeEmbeed.setColor(color)
   if (!color) makeEmbeed.setColor("Random")

   makeEmbeed.setTimestamp()

   return makeEmbeed
}
