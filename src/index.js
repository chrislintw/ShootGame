import './index.sass'
const canvas = document.getElementById('canvas')
canvas.style.width = window.innerWidth * 0.8
canvas.style.height = window.innerHeight * 0.8

canvas.width = parseInt(canvas.style.width) * 2
canvas.height = parseInt(canvas.style.height) * 2


// test canvas
const ctx = canvas.getContext('2d')
ctx.fillStyle = 'green'
ctx.fillRect(0, 0, 500, 500)
