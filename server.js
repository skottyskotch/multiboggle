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
    this.state = 'starting'; // [starting, rolling, gaming, ending]
    this.grid = [];
    this.solutions = [];
    this.gameTimer = undefined;
    Room.instances.push(this);

    this.mainLoop();
  }

  mainLoop(){
    var loop = setTimeout(
      () => {
        this.game++;
        console.log('Room ' + this.id + ' - Game #' + this.game + ' - rolling');
        this.state = 'rolling';
        io.sockets.in(this.id).emit('rolling', this.game);
        var grid_solutions = Boggle.boggle(); //  return {'grid':grid, 'solutions': solutions};
        this.grid = grid_solutions['grid'];
        this.solutions = grid_solutions['solutions'];

        console.log('Room ' + this.id + ' - Game #' + this.game + ' - game');
        this.state = 'gaming';
        io.sockets.in(this.id).emit('game', this.game, this.grid);
        var phase1 = setTimeout(() => {
          // compute results
          // emit results to the room
          console.log('Room ' + this.id + ' - Game #' + this.game + ' - results');
          this.state = 'ending';
          io.sockets.in(this.id).emit('solutions',this.game, this.solutions);
          var phase2 = setTimeout(() => {
            // reset timers
            loop.refresh();
          }, 1000); // display solutions duration
        }, 150000); // game duration
      },0);
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

var game = new Room();

function newConnection(socket){
  var player = new Player();
  console.log('new connection: player ' + player.name);
  socket.emit('hello', player.name);

  socket.on('playGame', function(playerName, welcome){
    // 1 choose the room
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
      if (noRoom == true) game = new Room();
    }
    console.log('Player ' + player.name + ' joins room #' + game.id);
    // 2 join the room
    socket.join(game.id);
    // 3 returns the room state
    let grid = [];
    let solutions = [];
    if (game.state == 'gaming') grid = game.grid;
    if (game.state == 'ending') {
      solutions = game.solutions;
      grid = game.grid;
    }
    welcome(game.id, game.state, game.game, grid, solutions);
  });
}