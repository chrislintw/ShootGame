var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3001;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.broadcast.emit('user connection', 'user connected');
  socket.on('disconnect', function(){
    io.emit('user connection', 'user disconnected');
    console.log('user disconnected');
  });
  socket.on('chat message', function(obj){
    console.log('message: ' + obj.msg);
    msg = obj.nickname + ":" + obj.msg;
    socket.broadcast.emit('chat message', msg);
  });
});


http.listen(port, function(){
  console.log('listening on *:' + port);
});