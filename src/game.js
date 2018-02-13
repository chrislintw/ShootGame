/* global io */

import fromEvent from 'xstream/extra/fromEvent'
import Oa from '@annotis/o-a'

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
  constructor (ctx) {
    this.ctx = ctx

    this.bullets = []
    this.players = new Oa('id')
    this.size = getSize(ctx)

    this.movePlayer = this.movePlayer.bind(this)
    this.createBullet = this.createBullet.bind(this)
    this.createPlayer = this.createPlayer.bind(this)

    this.socketID = null
    this.socket = io('/player')
    this.listenSocketEvents()

    this.createGameArea()
    this.createEnemy()
    this.bindEvents()
  }

  listenSocketEvents () {
    this.socket.on('connect', () => {
      this.socketID = this.socket.id

      this.socket.emit('fetch-players', ({ players }) => {
        this.resetPlayers(players)
      })

      this.socket.on('player-added', (player) => {
        this.createPlayer(player)
      })

      this.socket.on('moving', (player) => {
        this.updatePlayer(player)
      })

      this.socket.on('leaved', (player) => {
        this.removePlayer(player)
      })

      this.socket.on('sync-state', ({ players }) => {
        this.resetPlayers(players)
      })
    })
  }

  bindEvents () {
    fromEvent(document, 'keydown')
      .map(event => KEY_MOVING[event.key] || { x: 0, y: 0 })
      .addListener({ next: this.movePlayer })

    // fromEvent(this.ctx.canvas, 'click')
    //   .map(event => ({
    //     x: event.offsetX * this.size.widthRatio, y: event.offsetY * this.size.heightRatio
    //   }))
    //   .addListener({ next: this.createBullet })
  }

  update (delta) {
    this.updateBullets(delta)
  }

  draw () {
    this.enemy.draw(this.ctx)
    this.players.forEach(player => player.draw(this.ctx, this.socketID))
    this.bullets.map(bullet => bullet.draw(this.ctx))
  }

  createGameArea () {
    const { canvasWidth, canvasHeight } = getSize(this.ctx)
    this.gameArea = Rect.fromLeftTop({ x: 0, y: 0, width: canvasWidth, height: canvasHeight })
  }

  createEnemy () {
    const { canvasWidth, canvasHeight } = this.size
    this.enemy = new Enemy({ x: canvasWidth / 2, y: canvasHeight / 2 })
  }

  createPlayer (player) {
    this.players.push(new Player(player))
  }

  resetPlayers (players) {
    this.players = new Oa('id', players.map(p => new Player(p)))
  }

  removePlayer ({ id }) {
    this.players.removeKey(id)
  }

  createBullet (event) {
    this.bullets.push(new Bullet({
      x: this.player.x,
      y: this.player.y,
      toward: event
    }))
  }

  movePlayer ({ x, y }) {
    const me = this.players.atKey(this.socketID)
    me.move({ unitX: x, unitY: y })
    this.socket.emit('moving', { x: me.x, y: me.y })
  }

  updatePlayer ({ id, x, y }) {
    const player = this.players.atKey(id)
    player.set({ x, y })
  }

  updateBullets (delta) {
    this.bullets =
      this.bullets.filter(bullet => {
        bullet.update(delta)
        const doesHitTarget = this.checkBulletTargets(bullet)
        return this.gameArea.doesContain(bullet) && !doesHitTarget
      })
  }

  checkBulletTargets (bullet) {
    const doesHitTarget = this.enemy.isAlive() && this.enemy.doesContain(bullet)

    if (doesHitTarget) {
      this.enemy.getDamaged(bullet.constructor.damage)
    }

    return doesHitTarget
  }
}

export default Game
