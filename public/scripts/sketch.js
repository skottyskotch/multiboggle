// class Room
class Room {
	constructor(id, state, game, grid, solutions){
		this.id = id;
		this.game = game;
		this.state = state;
		this.rankings = [];
		this.grid = grid;
		this.linearGrid = [];
		this.possibilitiesHistory = [];
		this.possibilitiesHistoryByIndex = [];
		this.highlightedLetters = [];
		this.solutions = solutions;
		this.found = [];
		this.score = 0;
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
		this.possibilitiesHistoryByIndex = [[[0],[1],[2],[3],[4],[5],[6],[7],[8],[9],[10],[11],[12],[13],[14],[15]],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
		this.score = 0;
		this.found = [];
		this.rankings = [];

		console.log(this.found);
	}

	cleanWord(){
		this.highlightedLetters = [];
		this.possibilitiesHistory = [this.linearGrid,[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
		this.possibilitiesHistoryByIndex = [[[0],[1],[2],[3],[4],[5],[6],[7],[8],[9],[10],[11],[12],[13],[14],[15]],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
	}

	checkAnswer(score, word) {
		if (score > 0) {
			console.log('score: ' + score);
			console.log('word: ' + word);
			this.score = score;
			this.found.push(word.toUpperCase());
		} else if (score == 0) {
			// already found
		} else if (score == -1) {
			// not a solution
		}
	}

	checkLettersToHighlight(inputWord){
		inputWord = inputWord.toUpperCase();
		// search inputWord in possibilitiesHistory[inputWord.length - 1]
		var foundInPreviousPossible = this.findWordInPossible(inputWord);
		// create new possibilities
		var possibilitiesArray = this.findNewPossibilities(foundInPreviousPossible, inputWord);
	}

	findWordInPossible(inputWord){
		var result = [];
		var historyEntry = this.possibilitiesHistory[inputWord.length - 1];
		for (var i = 0; i < historyEntry.length; i++) {
			if (historyEntry[i] == inputWord.toUpperCase()) {
				result.push(i);
			}
		}
		return result;
	}

	findNewPossibilities(foundInPreviousPossible, inputWord) {
		//console.log('inputWord ' + inputWord + ' found ' + foundInPreviousPossible.length + ' times in possibilities')
		var resultHistory = [];
		var resultHistoryIndex = [];
		for (var wordIndex of foundInPreviousPossible) {
			var resultForOneElement = [];
			var resultForOneElementIndex = [];
			var word = this.possibilitiesHistory[inputWord.length-1][wordIndex];
			var wordByIndex = this.possibilitiesHistoryByIndex[inputWord.length-1][wordIndex];
			for (var letterIndex of hashNeighbors[wordByIndex.slice(-1)]) {
				if (wordByIndex.indexOf(letterIndex) == -1) {
					resultForOneElementIndex = this.possibilitiesHistoryByIndex[inputWord.length-1][wordIndex].slice();
					resultForOneElementIndex.push(letterIndex);
					resultHistoryIndex.push(resultForOneElementIndex);
					resultForOneElement.push(word+this.linearGrid[letterIndex]);
				}
			}
			resultHistory.push(...resultForOneElement);
		}
		this.possibilitiesHistoryByIndex[inputWord.length] = resultHistoryIndex;
		this.possibilitiesHistory[inputWord.length] = resultHistory;
		this.highlightedLetters = foundInPreviousPossible[0];
		this.highlightedLetters = this.possibilitiesHistoryByIndex[inputWord.length -1][foundInPreviousPossible[0]];
		if (this.highlightedLetters == undefined) this.highlightedLetters = [];
	}

	displayGrid(){
		// display the grid
		var squareLength = 50;
		var offset = 5;
		for (var i = 0; i < 4; i++){
			for (var j = 0; j < 4; j++){
				
				if (Room.instance.state == 'gaming') {
					stroke(255);
					if (Room.instance.highlightedLetters.indexOf(j*4+i) != -1) fill(100);
					else fill(0);
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

	displayRanks(){

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
						6 :[   1 ,2 ,3 ,   5,    7 ,   9 ,10,11            ],
						7 :[      2, 3 ,      6,          10,11            ],
						8 :[            4 ,5,          9 ,      12,13      ],
						9 :[            4 ,5, 6,    8 ,   10,   12,13,14   ],
						10:[               5, 6, 7 ,   9 ,   11,   13,14,15],
						11:[                  6, 7 ,      10,         14,15],
						12:[                        8 ,9 ,         13      ],
						13:[                        8 ,9 ,10,   12,   14   ],
						14:[                           9 ,10,11,   13,   15],
						15:[                              10,11,      14   ]};
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
			stroke('cyan');
			fill('cyan');
			textFont('futura');
			textSize(30);
			x = width/2 - 95;
			y = height*0.8;
			text('>', x-20, height*0.8, width-40, height-40);
			text(inputWord, x, y, width-40, height-40);
			displayScore();
		} else if (Room.instance.state == 'ending') {
			let x = 0.5 * width;
			let y = height * 0.2;
			textWithSprites('resultat ' + '#' + Room.instance.game, x, y, 1, 'CENTER');
			Room.instance.displayGrid();
			inputWord = '';
		}

	}
}

function displayScore(){
	textWithSprites('Score ' + Room.instance.score, 10, 10, 1, 'LEFT');
	for (var word of Room.instance.found.sort().sort(function(a, b){return b.length - a.length;})) {
		textWithSprites(word, 10, 50 + Room.instance.found.indexOf(word)*15, 0.8, 'LEFT');
		var wordScore = '';
		if (word.length == 3) wordScore = '1';
		else if (word.length == 4) wordScore = '1';
		else if (word.length == 5) wordScore = '2';
		else if (word.length == 6) wordScore = '3';
		else if (word.length == 7) wordScore = '5';
		else if (word.length >= 8) wordScore = '11';
		textWithSprites(wordScore, 150, 50 + Room.instance.found.indexOf(word)*15, 0.8 , 'RIGHT');
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
	if (Room.instance != undefined && Room.instance.state == 'gaming') {
		if (keyCode == BACKSPACE){
			inputWord = inputWord.substring(0, inputWord.length - 1);
			if (Room.instance.highlightedLetters.length > 0) Room.instance.highlightedLetters.pop();
		} 
		//else if (keyCode == ENTER) {
		//	if (inputWord.length <= 2) console.log('3 lettres mini');
		//	else {
		//		socket.emit('newWord',inputWord, function(answer, word){Room.instance.checkAnswer(answer, word)});
		//		Room.instance.cleanWord();
		//		inputWord = '';
		//	}
		//} 
		//else if (inputWord.length < 16 && [DELETE,RETURN,TAB,ESCAPE,SHIFT,CONTROL,OPTION,ALT,UP_ARROW,DOWN_ARROW,LEFT_ARROW,RIGHT_ARROW].indexOf(keyCode) == -1) {
		//	inputWord += key;
		//	Room.instance.checkLettersToHighlight(inputWord);
		//}
	}
}

function keyTyped(){
	if (Room.instance != undefined && Room.instance.state == 'gaming') {
		if (keyCode == ENTER) {
			if (inputWord.length <= 2) console.log('3 lettres mini');
			else {
				socket.emit('newWord',inputWord, function(answer, word){Room.instance.checkAnswer(answer, word)});
				Room.instance.cleanWord();
				inputWord = '';
			}
		} else if (inputWord.length < 16) {
			inputWord += key;
			Room.instance.checkLettersToHighlight(inputWord);
		}
	}
}

function launchGame(){
	socket.emit('playGame', inputName.value(), function (id, state, game, grid, solutions){
					// create the map object
					removeElements();
					started = true;
					Room.instance = new Room(id, state, game, grid, solutions);
				});
}




