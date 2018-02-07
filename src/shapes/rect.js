class Rect {
  constructor ({ x, y, width, height }) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  getEdges () {
    return {
      top: this.y - this.height / 2,
      bottom: this.y + this.height / 2,
      left: this.x - this.width / 2,
      right: this.x + this.width / 2
    }
  }

  doesContain (rect) {
    const targetEdges = rect.getEdges()
    const selfEdges = this.getEdges()

    return (
      targetEdges.top >= selfEdges.top &&
      targetEdges.bottom <= selfEdges.bottom &&
      targetEdges.left >= selfEdges.left &&
      targetEdges.right <= selfEdges.right
    )
  }
}

Rect.fromLeftTop = ({ x, y, width, height }) => (
  new Rect({ x: x + width / 2, y: y + height / 2, height, width })
)

export default Rect
