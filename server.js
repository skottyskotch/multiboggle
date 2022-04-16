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
    this.state = 'starting';
    this.gameTimer = undefined;
    Room.instances.push(this);

    let _this = this;
    setInterval(function () {_this.loop() },10000);
  }

  loop() {
    this.game++;
    console.log('Room ' + this.id + ' - Game #' + game + ' - rolling');
    // generate

    console.log('Room ' + this.id + ' - Game #' + game + ' - game');
    // emit grid to the room
    var loop = setTimeout(function() {
      // emit results to the room
      setTimeout(function() {
        // reset timers
      }, 1000);
    }, 1000);

var i = 0;
var loop = setTimeout(
            function () {
              i++;
              
              console.log('hey');
              setTimeout(function () {
                        console.log('ho');
                        if (i < 5) loop.refresh();
                      },2000);

            },1000);



var i = 0;
var loop = setTimeout(
            function () {
              i++;
              if (i < 5) loop.refresh();
              console.log('hey')}
            ,2000
          );




console.log('-----rolling');
    this.state = 'rolling';
    io.sockets.in(this.id).emit('rolling');
    var newRoll = Boggle.boggle();
console.log('playing');
    this.state = 'playing';
    io.sockets.in(this.id).emit('playing');
    let _this = this;
    setTimeout(function() {
      console.log('scoring');
      io.sockets.in(this.id).emit('scoring');
    }, 5000);
  }

  rollNewGrid(){
    //

  }
  runNewGame(){
      //2m30s game
  }
  waitNewGame(){
    //15-30s to count
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
    console.log(playerName + ' request a game');
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
}