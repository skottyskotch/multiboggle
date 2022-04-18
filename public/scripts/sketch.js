// class Map
class Room {
	constructor(id, state, game, grid, solutions){
		this.id = id;
		this.game = game;
		this.state = state;
		this.grid = grid;
		this.solutions = solutions;
		this.countDown = 0;

		Room.instance = this;
	}

	update() {
		
	}

	displayGrid(){
		// display the grid
		var squareLength = 50;
		var offset = 5;
		for (var i = 0; i < 4; i++){
			for (var j = 0; j < 4; j++){
				
				if (Room.instance.state == 'gaming') {
					stroke(255);
					fill(0);
				}
				if (Room.instance.state == 'ending') {
					stroke(125)
					fill(25);
				}
				let x = width/2 -(squareLength*4+offset*3)/2 +(squareLength+offset)*i;
				let y = height/2-(squareLength*4+offset*3)/2 +(squareLength+offset)*j;
				square(x, y, squareLength);
				if (Room.instance.grid != 'ending') textWithSprites(Room.instance.grid[j][i], x+squareLength/2, y+squareLength/4, 2, 'CENTER');
			}
		}
	}

	displayPlayerInfo(){
	
	}

	displayTop10(){

	}
}
Room.instance = undefined;

function preload() {
	fontSpriteSheet 		= loadImage("images/pixel_font_16x6.png");
}

function setup(){
	fontSprites = initSprite(fontSpriteSheet,16,6);
	fontTable=' !\"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_ abcdefghijklmnopqrstuvwxyz{|}~ çÜéÂAAçÊÊEÏÎIäaéAAÔÖOÛU';
	createCanvas(windowWidth,windowHeight);
	//let inputName = enterYourName();
	inputName = createInput();
	inputName.center();
	playButton = createButton('Play');
	playButton.position(width*0.5 - playButton.width*0.5, inputName.position().y + 30);
	playButton.mousePressed(launchGame);
	socket = io.connect('http://localhost:3000');
	socket.on('hello', (defaultPlayerName) => {inputName.value(defaultPlayerName);})
	socket.on('rolling', (game) => {
		if (Room.instance != undefined) {
			Room.instance.state = 'rolling';
			Room.instance.game = game;
		}
	});	
	socket.on('game', (game, grid) => {
		if (Room.instance != undefined) {
			Room.instance.state = 'gaming';
			Room.instance.grid = grid;
			Room.instance.game = game;
		}
	});
	socket.on('solutions', (game, solutions) => {
		if (Room.instance != undefined) {
			Room.instance.state = 'ending';
			Room.instance.solutions = solutions;
			Room.instance.game = game;
		}
	});
}

function draw(){
	background(0);
	if (Room.instance == undefined) {
		let x = 0.5*width;
		let y = height * 0.25 - 20;
		textWithSprites('MASSIVE BOGGLE', x, y, 1.8, 'CENTER');

		y = height * 0.5 - 40;
		textWithSprites('Enter your name', x, y, 1, 'CENTER');
	} else {
		let x = 0.5*width;
		let y = height * 0.1;
		textWithSprites('MASSIVE BOGGLE', x, y, 1.8, 'CENTER');
		if (Room.instance.state == 'rolling') {
			let x = 0.5*width;
			let y = height * 0.2;
			textWithSprites('nouveau tirage #' + Room.instance.game + '...', x, y, 1, 'CENTER');
		} else if (Room.instance.state == 'gaming') {
			let x = 0.5*width;
			let y = height * 0.2;
			textWithSprites('partie ' + '#' + Room.instance.game + ' en cours...', x, y, 1, 'CENTER');
			Room.instance.displayGrid();
		} else if (Room.instance.state == 'ending') {
			let x = 0.5*width;
			let y = height * 0.2;
			textWithSprites('partie ' + '#' + Room.instance.game + ' finie...', x, y, 1, 'CENTER');
			Room.instance.displayGrid();
		}

	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	if (Room.instance == undefined) {
		inputName.center();
		playButton.position(width*0.5 - playButton.width*0.5, inputName.position().y + 30);
	}
}

function launchGame(){
	socket.emit('playGame', inputName.value(), function (id, state, game, grid, solutions){
					// create the map object
					removeElements();
					started = true;
					console.log('room ' + id + ' - state: ' + state);
					Room.instance = new Room(id, state, game, grid, solutions);
				});
}