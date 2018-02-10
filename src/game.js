import fromEvent from 'xstream/extra/fromEvent'
import Oa from '@annotis/o-a'
import _ from 'lodash'

import Rect from './shapes/rect'
import { getSize } from './utils/canvas'
import Enemy from './enemy'
import Player from './player'
import Bullet from './bullet'
import * as socketFixture from './fixtures/socket'

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
    this.playerMe = null

    this.movePlayer = this.movePlayer.bind(this)
    this.createBullet = this.createBullet.bind(this)
    this.createPlayer = this.createPlayer.bind(this)
    this.changePlayer = this.changePlayer.bind(this)

    this.createGameArea()
    this.createEnemy()
    this.createPlayer()
    this.bindEvents()
  }

  bindEvents () {
    fromEvent(document.getElementById('create-player'), 'click')
      .addListener({ next: this.createPlayer })

    fromEvent(document.getElementById('change-player'), 'click')
      .addListener({ next: this.changePlayer })

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
    this.players.forEach(player => player.draw(this.ctx, this.playerMe))
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
    this.players.push(new Player(socketFixture.generatePlayerData()))
  }

  createBullet (event) {
    this.bullets.push(new Bullet({
      x: this.player.x,
      y: this.player.y,
      toward: event
    }))
  }

  changePlayer () {
    this.playerMe = this.players.atIndex(_.random(0, this.players.length - 1)).id
  }

  movePlayer ({ x, y }) {
    if (this.playerMe) {
      this.players.atKey(this.playerMe).move({ unitX: x, unitY: y })
    } else {
      this.players.atIndex(0).move({ unitX: x, unitY: y })
    }
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
