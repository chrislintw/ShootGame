import { getSize } from './utils/canvas'
import fromEvent from 'xstream/extra/fromEvent'
import Enemy from './enemy'
import Player from './player'

const KEY_MOVING = {
  a: { x: -1, y: 0 },
  s: { x: 0, y: 1 },
  d: { x: 1, y: 0 },
  w: { x: 0, y: -1 }
}

class Game {
  constructor (state = {}, ctx) {
    this.state = state
    this.ctx = ctx

    this.movePlayer = this.movePlayer.bind(this)

    this.createEnemy(state)
    this.createPlayer(state)
    this.bindEvents()
  }

  bindEvents () {
    fromEvent(document, 'keydown')
      .map(e => KEY_MOVING[e.key] || { x: 0, y: 0 })
      .addListener({ next: this.movePlayer })
  }

  update (timestep) {

  }

  draw () {
    this.state.enemy.draw(this.ctx)
    this.state.player.draw(this.ctx)
  }

  createEnemy (state) {
    const { width, height } = getSize(this.ctx)
    state.enemy = new Enemy({ x: width / 2, y: height / 2 })
  }

  createPlayer (state) {
    const { width, height } = getSize(this.ctx)
    state.player = new Player({ x: width / 2, y: height * 0.9 })
  }

  movePlayer ({ x, y }) {
    this.state.player.move({ unitX: x, unitY: y })
  }
}

export default Game
