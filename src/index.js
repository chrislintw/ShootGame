import './index.sass'
import { drawCenterGuideLine, clean, drawFPS } from './utils/canvas'

import Game from './game'

window.__ = {
  debug: true,
  isUpdating: true
}

const ctx = setupCanvas()
const game = new Game({}, ctx)

startGameLoop(
  function update (timestep) {

  },
  function draw (fps) {
    clean(ctx)
    game.draw()
    _debugMode(ctx, fps)
  }
)

function setupCanvas () {
  const canvas = document.getElementById('canvas')
  canvas.style.width = window.innerWidth * 0.8
  canvas.style.height = window.innerHeight * 0.8

  // TODO: fallbacks for non-retina screen
  canvas.width = parseInt(canvas.style.width) * 2
  canvas.height = parseInt(canvas.style.height) * 2

  return canvas.getContext('2d')
}

function _debugMode (ctx, fps) {
  if (!window.__.debug) return

  drawCenterGuideLine(ctx)
  drawFPS(ctx, fps)
}

function startGameLoop (update, draw) {
  let lastFrameTimeMs = 0
  const maxFPS = 60
  let delta = 0
  let timestep = 1000 / 50
  let fps = 60
  let framesThisSecond = 0
  let lastFpsUpdate = 0

  function panic () {
    delta = 0
  }

  function mainLoop (timestamp) {
    // Throttle the frame rate.
    if (timestamp < lastFrameTimeMs + (1000 / maxFPS)) {
      window.requestAnimationFrame(mainLoop)
      return
    }
    delta += timestamp - lastFrameTimeMs
    lastFrameTimeMs = timestamp

    if (timestamp > lastFpsUpdate + 1000) {
      fps = 0.25 * framesThisSecond + 0.75 * fps

      lastFpsUpdate = timestamp
      framesThisSecond = 0
    }
    framesThisSecond++

    var numUpdateSteps = 0
    while (delta >= timestep) {
      update(timestep)
      delta -= timestep
      if (++numUpdateSteps >= 240) {
        panic()
        break
      }
    }

    draw(fps)
    window.requestAnimationFrame(mainLoop)
  }

  window.requestAnimationFrame(mainLoop)
}
