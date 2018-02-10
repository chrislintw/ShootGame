import fromEvent from 'xstream/extra/fromEvent'

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
    this.players = []
    this.size = getSize(ctx)

    this.movePlayer = this.movePlayer.bind(this)
    this.createBullet = this.createBullet.bind(this)

    this.createGameArea()
    this.createEnemy()
    this.createPlayer()
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
    this.updateBullets(delta)
  }

  draw () {
    this.enemy.draw(this.ctx)
    this.player.draw(this.ctx)
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

  createPlayer () {
    const { canvasWidth, canvasHeight } = this.size
    this.player = new Player({ x: canvasWidth / 2, y: canvasHeight * 0.9 })
  }

  createBullet (event) {
    this.bullets.push(new Bullet({
      x: this.player.x,
      y: this.player.y,
      toward: event
    }))
  }

  movePlayer ({ x, y }) {
    this.player.move({ unitX: x, unitY: y })
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
