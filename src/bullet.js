class Bullet {
  constructor ({
    toward,
    x = 0,
    y = 0,
    width = Bullet.size,
    height = Bullet.size,
    flyingDistance = 0
  }) {
    this.direction = this.getDirection({ x, y }, toward)
    this.x = x
    this.y = y
    this.height = height
    this.width = width
    this.flyingDistance = flyingDistance
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
  damage: 1
})

export default Bullet
