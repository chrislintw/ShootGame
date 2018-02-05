import './index.sass'

let isUpdating = false
const config = {
  width: 480,
  height: 480,
  size: 30,
  step: 30,
  bullet: { size: 2, range: 200, speed: 4, damage: 1 },
  enemy: { size: { width: 60, height: 30 } },
  attackTypes: ['gun'],
  gun: { shotsFired: 30 }
}

const state = {
  x: config.width / 2,
  y: config.height / 2,
  enemy: { elem: $('<div class="enemy">'), hp: 30, x: config.width / 2, y: 100 },
  bullets: [],
  attackType: config.attackTypes[0]
}
const player = $('#player')
const stage = $('#main')

const moving = {
  87: [0, -1],
  83: [0, 1],
  65: [-1, 0],
  68: [1, 0]
}

const init = function () {
  isUpdating = true
  stage.css({
    width: config.width,
    height: config.height
  })
  player.css({
    width: config.size,
    height: config.size,
    top: state.y,
    left: state.x
  })
  createEnemy()
}

const isCollided = function (x, y) {
  return (
    (x + config.size) > config.width ||
    x < 0 ||
    (y + config.size) > config.height ||
    y < 0
  )
}

const move = function (direction) {
  const nextX = state.x + config.step * direction[0]
  const nextY = state.y + config.step * direction[1]
  if (isCollided(nextX, nextY)) return

  state.x = nextX
  state.y = nextY
}

const shoot = function (e) {
  const mouseCoordinate = { x: e.pageX, y: e.pageY }
  createBullet(mouseCoordinate)
}

function createBullet (mouseCoordinate) {
  const x = state.x + config.size / 2
  const y = state.y
  const element = $('<div class="bullet">')
    .css({
      width: config.bullet.size,
      height: config.bullet.size,
      top: y,
      left: x
    })
    .appendTo(stage)
  element.from = [x, y]
  element.x = x
  element.y = y

  element.radian = getRadian(element, mouseCoordinate)
  element.timer = setInterval(function () { flying(element) }, 33)
  state.bullets.push(element)
}

const update = function () {
  if (!isUpdating) return
  window.requestAnimationFrame(function () {
    player.css({
      top: state.y,
      left: state.x
    })
    updateEnemy()
    updateBullet()
    update()
  })
}

init()

const HANDLE_EVENTS = {
  keydown: handleKeydown,
  click: handleClick
}

const ATTACK_EVENTS = {
  gun: shoot
}

$(document).on('keydown click', function (e) {
  HANDLE_EVENTS[e.type](e)
  update()
})

function handleKeydown (e) {
  if (moving[e.which]) {
    move(moving[e.which])
  }
}

function handleClick (e) {
  ATTACK_EVENTS[state.attackType](e)
}

function flying (bullet) {
  const v = calculateXY(bullet)
  bullet.x += v[0]
  bullet.y += v[1]
  const distance = Math.abs(bullet.y - bullet.from[1])
  if (distance > config.bullet.range) {
    deleteBullet(bullet)
    return
  }

  checkBullets(bullet)
}

function updateBullet () {
  state.bullets.forEach(function (bullet) {
    bullet.css({ top: bullet.y, left: bullet.x })
  })
}

function checkBullets (bullet) {
  if (doesBulletHitEnemy(bullet.x, bullet.y) && state.enemy.hp > 0) {
    damageEnemy()
    deleteBullet(bullet)
  }
}

function createEnemy () {
  const elem = state.enemy.elem.css({
    top: state.enemy.y,
    left: state.enemy.x,
    width: config.enemy.size.width,
    height: config.enemy.size.height
  }).appendTo(stage)
}

function damageEnemy () {
  if (state.enemy.hp <= 0) return
  state.enemy.hp -= config.bullet.damage
}

function updateEnemy () {
  const enemy = state.enemy
  const elem = enemy.elem
  elem.css({ opacity: enemy.hp / 30 })
}

function doesBulletHitEnemy (x, y) {
  const enemy = state.enemy
  const enemyWidth = config.enemy.size.width
  const enemyHeight = config.enemy.size.height
  if (
    x <= (enemy.x + enemyWidth) &&
    x >= enemy.x &&
    y <= (enemy.y + enemyHeight) &&
    y >= enemy.y
  ) {
    return true
  }

  return false
}

function deleteBullet (bullet) {
  bullet.remove()
  state.bullets.splice(state.bullets.indexOf(bullet), 1)
  clearInterval(bullet.timer)
}

function getRadian (from, to) {
  return Math.atan2(to.y - from.y, to.x - from.x)
}

function calculateXY (bullet) {
  const vx = Math.cos(bullet.radian) * config.bullet.speed
  const vy = Math.sin(bullet.radian) * config.bullet.speed

  return [vx, vy]
}
