 
class Room {
  constructor(){
   this.id = Room.id++;
    this.maxPlayers = 10;
    this.players = [];
    this.game = 0;
    this.state = 'starting';
    this.gameTimer = undefined;
    Room.instances.push(this);
    var _this = this;
    _this.loop();
  }

    loop(){
      var loop = setTimeout(
      function(){
        this.game++;
        
        console.log('Room ' + this.id + ' - Game #' + this.game + ' - rolling');
        // generate

        console.log('Room ' + this.id + ' - Game #' + this.game + ' - game');
        // emit grid to the room
        var phase1 = setTimeout(function() {
          // emit results to the room
        console.log('Room ' + this.id + ' - Game #' + this.game + ' - resuts');
          var phase2 = setTimeout(function() {
            // reset timers
            loop.refresh();
          }, 1000);
        }, 5000);
      },0);
    }
  }
Room.id = 0;
Room.instances = [];

var toto = new Room();