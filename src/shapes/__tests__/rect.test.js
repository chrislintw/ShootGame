import test from 'ava'
import Rect from '../rect'

test('Rect.fromLeftTop - Creat Rect by left-top based information', t => {
  const leftTopRect = {
    x: 10,
    y: 20,
    width: 60,
    height: 100
  }

  const rect = Rect.fromLeftTop(leftTopRect)

  t.is(rect.x, 40)
  t.is(rect.y, 70)
  t.is(rect.width, 60)
  t.is(rect.height, 100)
})

test('rect.doesContain - contain another rect', t => {
  const outside = new Rect({ x: 50, y: 50, width: 100, height: 100 })
  const inside = new Rect({ x: 50, y: 50, width: 100, height: 100 })

  t.truthy(outside.doesContain(inside))
})

test('rect.doesContain - just meet the edges', t => {
  const outside = new Rect({ x: 50, y: 50, width: 100, height: 100 })
  const inside = new Rect({ x: 50, y: 50, width: 100, height: 100 })

  t.truthy(outside.doesContain(inside))
})

test('rect.doesContain - does not contain another rect', t => {
  const outside = new Rect({ x: 50, y: 50, width: 100, height: 100 })
  const inside = new Rect({ x: 50, y: 50, width: 110, height: 50 })

  t.falsy(outside.doesContain(inside))
})
