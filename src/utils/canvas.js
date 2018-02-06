export function getSize (ctx) {
  return {
    width: ctx.canvas.width,
    height: ctx.canvas.height
  }
}

export function drawCenterGuideLine (ctx) {
  const { width, height } = getSize(ctx)
  const center = { x: width / 2, y: height / 2 }
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
  const { width, height } = getSize(ctx)
  ctx.clearRect(0, 0, width, height)
}

export function drawFPS (ctx, fps) {
  ctx.fillStyle = '#333'
  ctx.font = '20px san-serif'
  ctx.fillText('FPS ' + Math.round(fps), 20, 30)
}
