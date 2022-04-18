// class Player
class Player {
  constructor(socketId){
    // new player is created as soon as reaching the home page
    this.id = Player.id++;
    this.socket = socketId;
    this.score = 0;
    this.rank = 0;
    Player.instances[this.id] = this;
    this.name = 'Anon'+this.id;
  }
}
Player.id = 0;
Player.instances = {};

console.log('server starting');
var express = require('express');
var app = express();
var server = app.listen(3000);
app.use(express.static('public'));
app.get('/', index);
function index(request, response){       
    response.sendFile('/public/index.html', {root: __dirname});
}

var socket = require('socket.io');
var io = socket(server);
io.sockets.on('connection', newConnection);
function newConnection(socket){
  var player = new Player();
  console.log('new connection: player ' + player.name);
  socket.emit('hello', player.name);
}