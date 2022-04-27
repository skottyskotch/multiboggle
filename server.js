var Boggle = require ('./Boggle');

// class Player
class Player {
  constructor(socketId){
    // new player is created as soon as reaching the home page
    this.id = socketId;
    this.score = 0;
    this.rank = 0;
    this.room = undefined;
    this.found = [];
    Player.instances[this.id] = this;
    this.number = Object.keys(Player.instances).length;
    this.name = 'Anon'+this.number;
  }

  cleanup(){
    this.score = 0;
    this.rank = 0;
    this.found = [];
  }
}
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

  ranks(){
    var playerScore = {};
    for (var player of this.players) {
      playerScore[player.name] = player.score; 
    }
    var players = Object.keys(playerScore).sort(function(a, b){return playerScore[b] - playerScore[a];});
    var scores = Object.values(playerScore).sort().reverse();
    return [players, scores];
  }

  checkSolution(word, player){
    if (player.found.indexOf(word.toUpperCase()) > -1) return 0; // already found
    else if (player.room.solutions.indexOf(word.toUpperCase()) > - 1) {
      player.found.push(word.toUpperCase());
    //Mot de 3 ou 4 lettres : 1 point
    //Mot de 5 lettres : 2 points
    //Mot de 6 lettres : 3 points
    //Mot de 7 lettres : 5 points
    //Mot de 8 lettres ou plus : 11 points
      if (word.length == 3) player.score += 1;
      else if (word.length == 4) player.score += 1;
      else if (word.length == 5) player.score += 2;
      else if (word.length == 6) player.score += 3;
      else if (word.length == 7) player.score += 5;
      else if (word.length >= 8) player.score += 11;
      return player.score;
    } else return -1; // not a solution
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
        for (var player of this.players) {
          player.cleanup();
        }

        console.log('Room ' + this.id + ' - Game #' + this.game + ' - game');
        this.state = 'gaming';
        io.sockets.in(this.id).emit('game', this.game, this.grid);
        var t1 = gameTime;
        const gameCountdown = setInterval(() => {
          t1--;
          var [players, scores] = this.ranks();
          io.sockets.in(this.id).emit('countdown', t1, players, scores);
        }, 1000);
        var phase1 = setTimeout(() => {
          // compute results
          // emit results to the room
          clearInterval(gameCountdown);
          t1 = gameTime;
          var t2 = resultTime;
          const resultCountdown = setInterval(() => {
            t2--;
            io.sockets.in(this.id).emit('countdown', t2);
          }, 1000);
          console.log('Room ' + this.id + ' - Game #' + this.game + ' - results');
          this.state = 'ending';
          io.sockets.in(this.id).emit('solutions',this.game, this.solutions);
          var phase2 = setTimeout(() => {
            // reset timers
            clearInterval(resultCountdown);
            t2 = resultTime;
            loop.refresh();
          }, resultTime*1000); // display solutions duration
        }, gameTime*1000); // game duration
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
var gameTime = 150;
var resultTime = 15;

function newConnection(socket){
  var player = new Player(socket.id);
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
    player.room = game;
    game.players.push(player);
    // 3 returns the room state
    let grid = [];
    let solutions = [];
    if (game.state == 'gaming') grid = game.grid;
    if (game.state == 'ending') {
      solutions = game.solutions;
      grid = game.grid;
    }
    welcome(game.id, game.state, game.game, grid, solutions, playerName);
  });

  socket.on('newWord', function(word, result){
    var score = Player.instances[socket.id].room.checkSolution(word,Player.instances[socket.id]);
    result(score, word);
  });
}