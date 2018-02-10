export function getSize (ctx) {
  const canvasWidth = ctx.canvas.width
  const canvasHeight = ctx.canvas.height
  const styleWidth = parseInt(ctx.canvas.style.width)
  const styleHeight = parseInt(ctx.canvas.style.height)

  return {
    canvasWidth,
    canvasHeight,
    styleWidth,
    styleHeight,
    widthRatio: canvasWidth / styleWidth,
    heightRatio: canvasHeight / styleHeight
  }
}

export function drawCenterGuideLine (ctx) {
  const { canvasWidth, canvasHeight } = getSize(ctx)
  const center = { x: canvasWidth / 2, y: canvasHeight / 2 }
  const length = 120

  ctx.strokeStyle = '#777'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(center.x - length / 2, center.y)
  ctx.lineTo(center.x + length / 2, center.y)
  ctx.stroke()
  ctx.moveTo(center.x, center.y - length / 2)
  ctx.lineTo(center.x, center.y + length / 2)
  ctx.stroke()
}

export function clean (ctx) {
  const { canvasWidth, canvasHeight } = getSize(ctx)
  ctx.clearRect(0, 0, canvasWidth, canvasHeight)
}

export function drawFPS (ctx, fps) {
  ctx.fillStyle = '#333'
  ctx.font = '20px san-serif'
  ctx.fillText('FPS ' + Math.round(fps), 20, 30)
}

// the canvas settings inside fn won't affect outside world
export function zone (ctx, fn) {
  ctx.save()
  fn()
  ctx.restore()
}

export function screenCenterMode (ctx) {
  const { canvasWidth, canvasHeight } = getSize(ctx)
  ctx.translate(canvasWidth / 2, canvasHeight / 2)
}
