import './index.sass'
import Enemy from './enemy'
import { getSize, drawCenterGuideLine, clean } from './utils/canvas'

window.__ = {
  debug: false,
  isUpdating: true
}

const ctx = setupCanvas()
const state = gameInit(ctx)
gameLoop(state)

function gameLoop (state) {
  if (!window.__.isUpdating) return
  window.requestAnimationFrame(function () {
    clean(state.canvas.main)

    state.enemy.draw(state.canvas.main)

    _debugMode(state)
    gameLoop(state)
  })
}

function setupCanvas () {
  const canvas = document.getElementById('canvas')
  canvas.style.width = window.innerWidth * 0.8
  canvas.style.height = window.innerHeight * 0.8

  // TODO: fallbacks for non-retina screen
  canvas.width = parseInt(canvas.style.width) * 2
  canvas.height = parseInt(canvas.style.height) * 2

  return canvas.getContext('2d')
}

function gameInit (ctx) {
  const state = {
    canvas: {
      main: ctx
    }
  }

  createEnemy(state)

  return state
}

function createEnemy (state) {
  const { width, height } = getSize(state.canvas.main)
  state.enemy = new Enemy({ x: width / 2, y: height / 2 })
}


function _debugMode(state) {
  if (!window.__.debug) return

  drawCenterGuideLine(state.canvas.main)
}
