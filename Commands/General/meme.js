const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const fetch = (...argument) => import("node-fetch").then(({ default: fetch }) => fetch(...argument))

module.exports = {
   data: new SlashCommandBuilder().setName("meme").setDescription("Get a meme."),
   // .addStringOption((option) =>
   //    option
   //       .setName("platform")
   //       .setDescription("Meme platform (optional)")
   //       .addChoices({ name: "Reddit", value: "reddit" }, { name: "Giphy", value: "giphy" })
   // ),
   /**
    *
    * @param {import("discord.js").Interaction} interaction
    */
   async execute(interaction) {
      const { options } = interaction

      // const platform = options.getString("platform")

      const embed = new EmbedBuilder()

      // async function redditMeme() {
      //    await fetch("https://www.reddit.com/r/memes/random/.json").then(async (res) => {
      //       if (!res) return interaction.reply({ embeds: [embed.setDescription("Memes not found.")] })
      //       let memes = await res.json()

      //       let title = memes[0].data.children[0].data.title
      //       let url = memes[0].data.children[0].data.url
      //       let author = memes[0].data.children[0].data.author

      //       return interaction.reply({
      //          embeds: [embed.setTitle(title).setImage(url).setURL(url).setColor("Random").setFooter({ text: author })],
      //       })
      //    })
      // }

      async function giphyMeme() {
         await fetch("https://api.giphy.com/v1/gifs/random?api_key=9qEZOKz1wI40MS3MSRHy3T9YVe51EJWi&tag=&rating=g").then(async (res) => {
            let meme = await res.json()

            let title = meme.data.title
            let url = meme.data.images.original.url
            let link = meme.data.url
            let author = meme.data.user.display_name
            let pf = meme.data.user.avatar_url

            return interaction.reply({
               embeds: [embed.setTitle(`${title}`).setImage(`${url}`).setURL(link).setColor("Random").setFooter({ text: author, iconURL: pf })],
            })
         })
      }

      // if (platform === "reddit") redditMeme()

      // if (platform === "giphy") giphyMeme()

      // if (!platform) {
      //    let memes = [giphyMeme(), redditMeme()]
      //    memes[Math.floor(Math.random() * memes.length)]
      // }
      giphyMeme()
   },
}
