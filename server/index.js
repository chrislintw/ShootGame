const _ = require('lodash')
const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const port = process.env.PORT || 3001

const colors = ['#9ABC8A', '#EDC951']
const players = []

io.on('connection', function (socket) {
  console.log('connected: ' + socket.id)

  socket.on('playerMoved', (moveTo) => {
    const player = _.find(players, player => player.id === socket.id)
    socket.emit('playerMoved', { id: socket.id, x: moveTo.x, y: moveTo.y })

    player.x = moveTo.x
    player.y = moveTo.y
  })

  const currentPlayer = createPlayer(socket.id)
  // send this event to all players except sender
  socket.broadcast.emit('playerCreated', currentPlayer)
  io.to(socket.id).emit('init', { players })

  socket.on('disconnect', function () {
    _.remove(players, player => player.id === socket.id)

    io.emit('playerLeaved', { id: socket.id })
    console.log('disconnected: ' + socket.id)
  })
})

http.listen(port, function () {
  console.log('listening on *:' + port)
})

function createPlayer (id) {
  // server
  const player = {
    id,
    name: 'Player' + (players.length + 1),
    color: colors[players.length % 2],
    x: 0 + Math.round(Math.random() * 80),
    y: 0 + Math.round(Math.random() * 80)
  }

  players.push(player)

  return player
}
