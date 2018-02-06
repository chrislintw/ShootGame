class Player {
  constructor ({
    x = 0,
    y = 0,
    width = Player.size.width,
    height = Player.size.height,
    step = Player.step
  }) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.step = step
  }

  draw (ctx) {
    ctx.fillStyle = '#facf15'
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 4

    ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height)
    ctx.strokeRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height)
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
  step: 20
})

export default Player
