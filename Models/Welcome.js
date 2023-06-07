const { model, Schema } = require("mongoose")

let welcomeSchema = new Schema({
   Guild: String,
   Channel: String,
   Message: String,
   Role: { type: String, required: false },
})

module.exports = model("Welcome", welcomeSchema)
