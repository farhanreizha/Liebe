/**
 *
 * @param {import('distube').Queue} queue
 * @returns
 */
module.exports = (queue) =>
   `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.names.join(", ") || "Off"}\` | Repeat: \`${
      queue.repeatMode ? (queue.repeatMode === 2 ? "Playlist" : "Song") : "Off"
   }\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``
