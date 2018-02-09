import fromEvent from 'xstream/extra/fromEvent'
import _ from 'lodash'

import Rect from './shapes/rect'
import { getSize } from './utils/canvas'
import Enemy from './enemy'
import Player from './player'
import Bullet from './bullet'

const KEY_MOVING = {
  a: { x: -1, y: 0 },
  s: { x: 0, y: 1 },
  d: { x: 1, y: 0 },
  w: { x: 0, y: -1 }
}

class Game {
  constructor (
    state = {},
    ctx
  ) {
    this.ctx = ctx

    this.state = state
    this.state.bullets = []
    this.state.players = []
    this.size = getSize(ctx)

    this.movePlayer = this.movePlayer.bind(this)
    this.createBullet = this.createBullet.bind(this)
    this.createPlayer = this.createPlayer.bind(this)

    this.createGameArea()
    this.createEnemy()

    this.bindEvents()

    const self = this
    const socket = io()

    this.socket = socket

    socket.on('connect', function () {
      this.connectionId = socket.id
    })

    socket.on('init', function ({ players }) {
      players.forEach(function (playerInfo) {
        const player = self.createPlayer(playerInfo)
        if (player.id === self.connectionId) {
          self.myPlayer = player
        }
      })
    })

    socket.on('playerCreated', function (player) {
      self.createPlayer(player)
    })

    socket.on('playerMoved', function (moveTo) {
      self.onPlayerMoved(moveTo)
    })

    socket.on('playerLeaved', function (player) {
      self.removePlayer(player)
    })
  }

  bindEvents () {
    fromEvent(document, 'keydown')
      .map(event => KEY_MOVING[event.key] || { x: 0, y: 0 })
      .addListener({ next: this.movePlayer })

    fromEvent(this.ctx.canvas, 'click')
      .map(event => ({
        x: event.offsetX * this.size.widthRatio, y: event.offsetY * this.size.heightRatio
      }))
      .addListener({ next: this.createBullet })
  }

  update (delta) {
    this.updateBullets(delta)
  }

  draw () {
    if (this.state.enemy) { this.state.enemy.draw(this.ctx) }
    this.state.players.map(player => player.draw(this.ctx))
    this.state.bullets.map(bullet => bullet.draw(this.ctx))
  }

  createGameArea () {
    const { canvasWidth, canvasHeight } = getSize(this.ctx)
    this.gameArea = Rect.fromLeftTop({ x: 0, y: 0, width: canvasWidth, height: canvasHeight })
  }

  createEnemy () {
    const { canvasWidth, canvasHeight } = this.size
    this.state.enemy = new Enemy({ x: canvasWidth / 2, y: canvasHeight / 2 })
  }

  createPlayer ({ x, y, id, name, color }) {
    const player = new Player({ x, y, name, color, id })
    this.state.players.push(player)

    return player
  }

  removePlayer ({ id }) {
    _.remove(this.state.players, player => player.id === id)
  }

  createBullet (event) {
    this.state.bullets.push(new Bullet({
      x: this.state.player.x,
      y: this.state.player.y,
      toward: event
    }))
  }

  movePlayer (to) {
    this.socket.emit('playerMoved', to)
  }

  onPlayerMoved ({ id, x, y }) {
    _.find(this.state.players, player => player.id === id).move({ unitX: x, unitY: y })
  }

  updateBullets (delta) {
    this.state.bullets =
      this.state.bullets.filter(bullet => {
        bullet.update(delta)
        const doesHitTarget = this.checkBulletTargets(bullet)
        return this.gameArea.doesContain(bullet) && !doesHitTarget
      })
  }

  checkBulletTargets (bullet) {
    const doesHitTarget = this.state.enemy.isAlive() && this.state.enemy.doesContain(bullet)

    if (doesHitTarget) {
      this.state.enemy.getDamaged(bullet.constructor.damage)
    }

    return doesHitTarget
  }
}

export default Game
