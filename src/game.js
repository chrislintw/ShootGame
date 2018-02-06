import Enemy from './enemy'
import { getSize } from './utils/canvas'

class Game {
  constructor (state = {}, ctx) {
    this.state = state
    this.ctx = ctx

    this.createEnemy(state)
  }

  draw () {
    this.state.enemy.draw(this.ctx)
  }

  createEnemy (state) {
    const { width, height } = getSize(this.ctx)
    state.enemy = new Enemy({ x: width / 2, y: height / 2 })
  }
}

export default Game
