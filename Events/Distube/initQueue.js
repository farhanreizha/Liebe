const { Events } = require("distube")

module.exports = {
   name: Events.INIT_QUEUE,
   /**
    *
    * @param {import("distube").Queue} queue
    */
   async execute(queue) {
      queue.autoplay = false
      queue.volume = 50
   },
}
