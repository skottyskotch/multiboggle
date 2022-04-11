var Boggle = require ('./Boggle');

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

class Room {
  constructor(){
    // new room is created as soon as the first player enters
    this.id = Room.id++;
    this.maxPlayers = 10;
    this.players = [];
    this.game = 0;
    Room.instances.push(this);
  }
}
Room.id = 0;
Room.instances = [];

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
  socket.emit("hello", player.name);

  socket.on('playGame', function(playerName, welcome){
    console.log(playerName);
    player.name = playerName;
    var game = undefined;
    if (Room.instances.length == 0) game = new Room();
    else {
      var noRoom = true;
      for (var eachRoom of Room.instances){
        if (eachRoom.players.length < eachRoom.maxPlayers) {
          game = eachRoom;
          noRoom = false;
        }
      }
      if (noRoom == true) game = new room();
      socket.join('game', game.id);
    }
    welcome(game.id);
  });
  function newGame(playerName){
    console.log(playerName);
  }
}

function startBoggle(){
  
}