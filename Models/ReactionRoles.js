const { model, Schema } = require("mongoose")

let reactionRoles = new Schema({
   GuildID: String,
   Roles: Array,
})

module.exports = model("ReactionRoles", reactionRoles)
