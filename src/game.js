import { getSize } from './utils/canvas'
import fromEvent from 'xstream/extra/fromEvent'
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
    this.size = getSize(ctx)

    this.movePlayer = this.movePlayer.bind(this)
    this.createBullet = this.createBullet.bind(this)

    this.createEnemy(state)
    this.createPlayer(state)
    this.bindEvents()
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
    this.state.bullets.map(bullet => bullet.update(delta))
  }

  draw () {
    this.state.enemy.draw(this.ctx)
    this.state.player.draw(this.ctx)
    this.state.bullets.map(bullet => bullet.draw(this.ctx))
  }

  createEnemy (state) {
    const { canvasWidth, canvasHeight } = this.size
    state.enemy = new Enemy({ x: canvasWidth / 2, y: canvasHeight / 2 })
  }

  createPlayer (state) {
    const { canvasWidth, canvasHeight } = this.size
    state.player = new Player({ x: canvasWidth / 2, y: canvasHeight * 0.9 })
  }

  createBullet (event) {
    this.state.bullets.push(new Bullet({
      x: this.state.player.x,
      y: this.state.player.y,
      toward: event
    }))
  }

  movePlayer ({ x, y }) {
    this.state.player.move({ unitX: x, unitY: y })
  }
}

export default Game
