import _ from 'lodash'
import Rect from './shapes/rect'

class Bullet extends Rect {
  constructor ({
    toward,
    gameArea,
    flyingDistance = 0
  }) {
    super(...arguments)

    this._default()

    this.direction = this.getDirection({ x: this.x, y: this.y }, toward)
  }

  _default () {
    _.defaults(this, {
      x: 0,
      y: 0,
      width: Bullet.size,
      height: Bullet.size
    })
  }

  update (delta) {
    this.x += Math.cos(this.direction) * Bullet.speed * delta
    this.y += Math.sin(this.direction) * Bullet.speed * delta
  }

  draw (ctx) {
    ctx.fillStyle = '#333'
    ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height)
  }

  getDirection (from, to) {
    return Math.atan2(to.y - from.y, to.x - from.x)
  }
}

Object.assign(Bullet, {
  size: 4,
  maxDistance: 200,
  speed: 0.1,
  damage: 5
})

export default Bullet
