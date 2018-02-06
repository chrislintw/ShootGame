import './index.sass'
import { drawCenterGuideLine, clean } from './utils/canvas'

import Game from './game'

window.__ = {
  debug: false,
  isUpdating: true
}

const ctx = setupCanvas()
const game = new Game({}, ctx)
gameLoop(game, ctx)

function gameLoop (game, ctx) {
  if (!window.__.isUpdating) return
  window.requestAnimationFrame(function () {
    clean(ctx)

    game.draw()

    _debugMode(ctx)
    gameLoop(game, ctx)
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

function _debugMode (ctx) {
  if (!window.__.debug) return

  drawCenterGuideLine(ctx)
}
