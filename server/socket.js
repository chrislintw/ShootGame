const playerChannel = require('./channels/player')

function socket (io) {
  playerChannel(io)
}

module.exports = socket
