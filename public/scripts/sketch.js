// class Room
class Room {
	constructor(id, state, game, grid, solutions){
		this.id = id;
		this.game = game;
		this.state = state;
		this.grid = grid;
		this.linearGrid = [];
		this.possibilitiesHistory = [];
		this.highlightedLetters = [];
		this.solutions = solutions;
		this.countDown = 0;
		this.update(grid);
		Room.instance = this;
	}

	update(grid) {
		this.grid = grid;
		this.linearGrid = [];
		this.linearGrid.push(...this.grid[0]);
		this.linearGrid.push(...this.grid[1]);
		this.linearGrid.push(...this.grid[2]);
		this.linearGrid.push(...this.grid[3]);
		this.possibilitiesHistory = [this.linearGrid,[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
	}

	checkLettersToHighlight(inputWord){
		inputWord = inputWord.toUpperCase();
		console.log('inputWord: ' + inputWord);
		// search inputWord in possibilitiesHistory[inputWord.length - 1]
		var foundInPreviousPossible = findLetterInPossible(inputWord);
		// create new possibilities
		this.possibilitiesHistory[inputWord.length] = findNewPossibilities(foundInPreviousPossible, inputWord);
		this.highlightedLetters = foundInPreviousPossible[0];
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
	inputWord = '';
	hashNeighbors = {	0 :[   1 ,      4 ,5                               ],
						1 :[0 ,   2 ,   4 ,5 ,6                            ],
						2 :[   1 ,   3 ,   5 ,6 ,7                         ],
						3 :[      2,          6 ,7                         ],
						4 :[0 ,1 ,         5,       8 ,9                   ],
						5 :[0 ,1 ,2 ,   4 ,   6,    8 ,9 ,10               ],
						6 :[   1 ,2 ,3 ,   5,    7 ,               13,14,15],
						7 :[      2, 3 ,      6,          10,11            ],
						8 :[            4 ,5,          9 ,      12,13      ],
						9 :[            4 ,5, 6,    8 ,   10,   12,13,14   ],
						10:[               5, 6, 7 ,   9 ,   11,   13,14,15],
						11:[                  6, 7 ,      10,         14,15],
						12:[                        8 ,9 ,         13      ],
						13:[                        8 ,9 ,10,   12,   14   ],
						14:[                           9 ,10,11,   13,   15],
						15:[                              10,11,      14   ]};
	highlightedLetters = [];
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
			Room.instance.update(grid);
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
			textWithSprites('tirage #' + Room.instance.game + '...', x, y, 1, 'CENTER');
		} else if (Room.instance.state == 'gaming') {
			let x = 0.5*width;
			let y = height * 0.2;
			textWithSprites('partie ' + '#' + Room.instance.game, x, y, 1, 'CENTER');
			Room.instance.displayGrid();
			fill('cyan');
			textFont('futura');
			textSize(30);
			x = width/2 - 95;
			y = height*0.8;
			text('>', x-20, height*0.8, width-40, height-40);
			text(inputWord, x, y, width-40, height-40);
			if (Room.instance.highlightedLetters.length > 0) highlightLetters();
		} else if (Room.instance.state == 'ending') {
			let x = 0.5 * width;
			let y = height * 0.2;
			textWithSprites('resultat ' + '#' + Room.instance.game, x, y, 1, 'CENTER');
			Room.instance.displayGrid();
			inputWord = '';
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

function keyPressed(){
	if (Room.instance != undefined) {
		if (keyCode == BACKSPACE){
			console.log('BACKSPACE');
			inputWord = inputWord.substring(0, inputWord.length -1);
			Room.instance.possibilitiesHistory.pop();
		} else if (inputWord.length < 16 && [DELETE,ENTER,RETURN,TAB,ESCAPE,SHIFT,CONTROL,OPTION,ALT,UP_ARROW,DOWN_ARROW,LEFT_ARROW,RIGHT_ARROW].indexOf(keyCode) == -1) {
			inputWord += key;
			highlightedLetters = Room.instance.checkLettersToHighlight(inputWord);
		}
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



function findLetterInPossible(inputWord){
	var result = [];
	var historyEntry = Room.instance.possibilitiesHistory[inputWord.length - 1];
	for (var i = 0; i < historyEntry.length; i++) {
		if (historyEntry[i] == inputWord) {
			result.push(i);
		}
	}
	return result;
}

function findNewPossibilities(foundInPreviousPossible, inputWord) {
	var result = [];
	for (var wordIndex of foundInPreviousPossible) {
		var resultForOneElement = [];
		for (var letter in hashNeighbors[wordIndex]) {
			if (resultForOneElement.indexOf(letter) == -1) resultForOneElement.push(inputWord+letter);
		}
		result.push(...resultForOneElement);
	}
	return result;
}



