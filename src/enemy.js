import _ from 'lodash'
import Rect from './shapes/rect'

class Enemy extends Rect {
  constructor ({
    hp,
    maxHP
  }) {
    super(...arguments)

    this.hp = this.hp
    this.maxHP = this.maxHP

    this._default()
  }

  _default () {
    _.defaults(this, {
      x: 0,
      y: 0,
      width: Enemy.size.width,
      height: Enemy.size.height,
      maxHP: Enemy.maxHP,
      hp: Enemy.maxHP
    })
  }

  draw (ctx) {
    if (!this.isAlive()) return

    ctx.globalAlpha = this.hp / this.maxHP
    ctx.fillStyle = '#fa5752'
    ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height)
    ctx.globalAlpha = 1
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 4
    ctx.strokeRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height)

    this._drawHP(ctx)
  }

  _drawHP (ctx) {
    const length = 100

    // maxHP
    ctx.fillStyle = '#b43544'
    ctx.fillRect(this.x - length / 2, this.y - this.height / 2 - 20, length, 5)

    // HP
    ctx.fillStyle = '#63c310'
    ctx.fillRect(this.x - length / 2, this.y - this.height / 2 - 20, this.hp / this.maxHP * length, 5)
  }

  getDamaged (damage) {
    if (this.isAlive()) {
      this.hp -= damage
    } else {
      this.hp = 0
    }

    return this.hp
  }

  isAlive () {
    return this.hp > 0
  }
}

Enemy.size = {
  width: 60,
  height: 30
}
Enemy.maxHP = 100

export default Enemy
