export function getSize (ctx) {
  return {
    width: ctx.canvas.width,
    height: ctx.canvas.height
  }
}

export function drawCenterGuideLine (ctx) {
  if (!window.__.debug) return

  const { width, height } = getSize(ctx)
  const center = { x: width / 2, y: height / 2 }
  const length = 120

  ctx.strokeStyle = '#777'
  ctx.beginPath()
  ctx.moveTo(center.x - length / 2, center.y)
  ctx.lineTo(center.x + length / 2, center.y)
  ctx.stroke()
  ctx.moveTo(center.x, center.y - length / 2)
  ctx.lineTo(center.x, center.y + length / 2)
  ctx.stroke()
}
