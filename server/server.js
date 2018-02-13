var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var socket = require('./socket')
var port = process.env.PORT || 3888

socket(io)

http.listen(port, function () {
  console.log('listening on *:' + port)
})
