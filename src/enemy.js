class Enemy {
  constructor ({
    x = 0,
    y = 0,
    width = Enemy.size.width,
    height = Enemy.size.height,
    hp = 100
  }) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.hp = hp
  }

  draw (ctx) {
    ctx.fillStyle = '#3656c6'
    ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height)
  }

  getDamaged (damage) {
    if (this.hp > 0) {
      this.hp -= damage
    }

    return this.hp
  }
}

Enemy.size = {
  width: 60,
  height: 30
}

export default Enemy
