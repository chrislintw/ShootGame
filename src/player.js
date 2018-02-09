import { zone } from './utils/canvas'

class Player {
  constructor ({
    name = 'GGininder',
    x = 0,
    y = 0,
    width = Player.size.width,
    height = Player.size.height,
    step = Player.step,
    color = Player.color,
    id
  }) {
    this.id = id
    this.name = name
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.step = step

    this.color = color
  }

  draw (ctx) {
    zone(ctx, () => {
      ctx.fillStyle = this.color
      ctx.strokeStyle = '#333'
      ctx.lineWidth = 4

      ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height)
      ctx.strokeRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height)

      this._drawName(ctx)
    })
  }

  _drawName (ctx) {
    if (!this.name) return
    ctx.fillStyle = '#777'
    ctx.font = '14px san-serif'
    ctx.textAlign = 'center'
    ctx.fillText(this.name, this.x, this.y - this.height / 2 - 10)
  }

  move ({ unitX, unitY }) {
    this.x += unitX * this.step
    this.y += unitY * this.step
  }
}

Object.assign(Player, {
  size: {
    width: 20,
    height: 20
  },
  step: 20,
  color: '#facf15'
})

export default Player
