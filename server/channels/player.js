const faker = require('faker')
const _ = require('lodash')
const Oa = require('@annotis/o-a')

const players = new Oa('id')

function playerChannel (io) {
  const channel = io.of('/player')
  let syncStateTimer = null

  channel.on('connection', socket => {
    const id = socket.id

    const newPlayer = addPlayer({ id })
    socket.broadcast.emit('player-added', newPlayer)

    socket.on('moving', ({ x, y }) => {
      const player = players.atKey(id)
      player.x = x
      player.y = y

      socket.broadcast.emit('moving', player)
    })

    socket.on('disconnect', () => {
      players.removeKey(id)
      socket.broadcast.emit('leaved', { id })
      syncStateTimer && clearInterval(syncStateTimer)
    })

    socket.on('fetch-players', (answer) => {
      answer({ players: players.array })
    })

    syncStateTimer = setInterval(() => {
      socket.emit('sync-state', { players: players.array })
    }, 2000)
  })
}

function addPlayer ({ id }) {
  const player = _buildPlayer(id)
  players.push(player)

  return player
}

// function onCreated () {

// }

function _buildPlayer (id) {
  return {
    id,
    color: faker.commerce.color(),
    name: faker.name.findName(),
    x: _.random(-200, 200),
    y: _.random(-200, 200)
  }
}

module.exports = playerChannel
