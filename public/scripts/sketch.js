// class Room
class Room {
	constructor(id, state, game, grid, solutions, playerName){
		this.id = id;
		this.game = game;
		this.playerName = playerName;
		this.state = state;
		this.rankings = [[],[]];
		this.grid = grid;
		this.linearGrid = [];
		this.possibilitiesHistory = [];
		this.possibilitiesHistoryByIndex = [];
		this.highlightedLetters = [];
		this.solutions = solutions;
		this.found = [];
		this.score = 0;
		this.totalScore = 0;
		this.lastWinnerIndex = -1;
		this.time = 0;
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
		this.totalScore = 0;
		this.found = [];
		this.rankings = [[],[]];
	}

	cleanWord(){
		this.highlightedLetters = [];
		this.possibilitiesHistory = [this.linearGrid,[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
		this.possibilitiesHistoryByIndex = [[[0],[1],[2],[3],[4],[5],[6],[7],[8],[9],[10],[11],[12],[13],[14],[15]],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
	}

	computeTotalScore(){
		var totalScore = 0;
		for (var word of this.solutions){
			if (word.length == 3) totalScore += 1;
			else if (word.length == 4) totalScore += 1;
			else if (word.length == 5) totalScore += 2;
			else if (word.length == 6) totalScore += 3;
			else if (word.length == 7) totalScore += 5;
			else if (word.length >= 8) totalScore += 11;
		}
		this.totalScore = totalScore;
	}

	checkAnswer(score, word) {
		var answerMessage = '';
		var answerColor = [204,51,0];
		if (score > 0) {
			answerColor = [51,153,255];
			this.score = score;
			this.found.push(word.toUpperCase());
			answerMessage = word.toUpperCase() + '   ' + str(score);
		} else if (score == 0) {
			// already found
			answerMessage = word.toUpperCase() + ' déjà trouvé';
		} else if (inputWord.toUpperCase() != Room.instance.highlightedLetters.map((i) => Room.instance.linearGrid[i]).join('').toUpperCase()){
			answerMessage = word.toUpperCase() + ' pas dans la grille';
		} else if (score == -1) {
			// not a solution
			answerMessage = word.toUpperCase() + ' pas dans le dictionnaire'
		}
		Room.instance.cleanWord();
		inputWord = '';
		return [answerMessage,answerColor];
	}

	checkLettersToHighlight(inputWord){
		inputWord = inputWord.toUpperCase();
		// search inputWord in possibilitiesHistory[inputWord.length - 1]
		var foundInPreviousPossible = this.findWordInPossible(inputWord);
		// create new possibilities
		if(foundInPreviousPossible.length != 0) this.findNewPossibilities(foundInPreviousPossible, inputWord);
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
			var wordByIndex = [...this.possibilitiesHistoryByIndex[inputWord.length-1][wordIndex]];
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
		this.highlightedLetters = [...this.possibilitiesHistoryByIndex[inputWord.length -1][foundInPreviousPossible[0]]];
		if (this.highlightedLetters == undefined) this.highlightedLetters = [];
	}

	displayGrid(){
		// display the grid
		var squareLength = 50;
		var offset = 5;
		for (var i = 0; i < 4; i++){
			for (var j = 0; j < 4; j++){
				if (this.state == 'gaming') {
					stroke(255);
					if (this.highlightedLetters.indexOf(j*4+i) != -1) fill(100);
					else fill(0);
				}
				if (Room.instance.state == 'ending') {
					stroke(125)
					fill(25);
				}
				let x = width/2 -(squareLength*4+offset*3)/2 +(squareLength+offset)*i;
				let y = height/2-(squareLength*4+offset*3)/2 +(squareLength+offset)*j;
				square(x, y, squareLength);
				if (this.grid != 'ending') textWithSprites(this.grid[j][i], x+squareLength/2, y+squareLength/4, textZoom*2, 'CENTER');
			}
		}
	}

	displayScore(){
		textWithSprites(this.playerName + ' ' + this.score, 10, 10, textZoom*1, 'LEFT');
		for (var word of this.found.sort().sort(function(a, b){return b.length - a.length;})) {
			textWithSprites(word, 10, 50 + this.found.indexOf(word)*15, textZoom*0.8, 'LEFT');
			var wordScore = '';
			if (word.length == 3) wordScore = '1';
			else if (word.length == 4) wordScore = '1';
			else if (word.length == 5) wordScore = '2';
			else if (word.length == 6) wordScore = '3';
			else if (word.length == 7) wordScore = '5';
			else if (word.length >= 8) wordScore = '11';
			textWithSprites(wordScore, 150, 50 + this.found.indexOf(word)*15, textZoom*0.8 , 'RIGHT');
		}
	}

	displayTime(){
		textWithSprites(this.time.toString(), width/2, 10, textZoom*1, 'CENTER');
	}

	displayRanks(){
		textWithSprites('Classement', width - 10, 10, textZoom*1, 'RIGHT');
		for (var i = 0; i < this.rankings[0].length; i++){
			if (this.lastWinnerIndex != -1 && this.lastWinnerIndex == i) image(crownImage, width - 50 - (this.rankings[0][i].toString().length+1)*16-14, 25 + i*15 + 14, 28, 28);
			textWithSprites(this.rankings[1][i].toString(), width - 10, 50 + i*15, textZoom*1, 'RIGHT');
			textWithSprites(this.rankings[0][i], width - 50, 50 + i*15, textZoom*1, 'RIGHT');
		}
	}

	displaySolutions(){
		for (var i = 0; i < this.solutions.length; i++){
			if (this.found.indexOf(this.solutions[i]) == -1) tint(100,100,100);
			else noTint()
			textWithSprites(this.solutions[i], 10, 50 + i*15, textZoom*0.8, 'LEFT');
			var wordScore = 0;
			if (this.solutions[i].length == 3) wordScore = 1;
			else if (this.solutions[i].length == 4) wordScore = 1;
			else if (this.solutions[i].length == 5) wordScore = 2;
			else if (this.solutions[i].length == 6) wordScore = 3;
			else if (this.solutions[i].length == 7) wordScore = 5;
			else if (this.solutions[i].length >= 8) wordScore = 11;
			textWithSprites(wordScore.toString(), 150, 50 + i*15, textZoom*0.8, 'LEFT');
		}
		noTint();
		textWithSprites('Total', 10, 10, textZoom*1, 'LEFT');
		textWithSprites(this.totalScore.toString(), 150, 10, textZoom*1, 'LEFT');
	}
}
Room.instance = undefined;

function preload() {
	//fontSpriteSheet 		= loadImage("images/pixel_font_15x8.png");
	fontSpriteSheet 		= loadImage("images/pixel_font_16x6.png");
	crownImage 				= loadImage("images/crown1.png");
	//crownImage 				= loadImage("images/crown2.png");
	//crownImage 				= loadImage("images/crown3.png");		
}

function setup(){
	textZoom = 0.8;
	fontSprites = initSprite(fontSpriteSheet,16,6);
	//fontSprites = initSprite(fontSpriteSheet,15,8);
	fontTable=' !\"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_ abcdefghijklmnopqrstuvwxyz{|}~ çÜéÂAAçÊÊEÏÎIäaéAAÔÖOÛU';
	createCanvas(windowWidth,windowHeight);
	//let inputName = enterYourName();
	inputName = createInput();
	inputName.center();
	inputWord = '';
	answerMessage = '';
	answerColor = [0,0,0];
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
			Room.instance.cleanWord();
			Room.instance.update(grid);
			Room.instance.game = game;
		}
	});
	socket.on('solutions', (game, solutions) => {
		if (Room.instance != undefined) {
			Room.instance.state = 'ending';
			Room.instance.solutions = solutions;
			Room.instance.computeTotalScore();
			Room.instance.game = game;
		}
	});
	socket.on('countdown', (time, players, scores, lastWinnerIndex) => {
		if (Room.instance != undefined) {
			Room.instance.time = time;
			Room.instance.rankings = [players,scores];
			Room.instance.lastWinnerIndex = lastWinnerIndex;
		}
	});
}

function draw(){
	background(0);
	if (Room.instance == undefined) {
		let x = 0.5*width;
		let y = height * 0.25 - 20;
		textWithSprites('MASSIVE BOGGLE', x, y, textZoom*1.8, 'CENTER');
		y = height * 0.5 - 40;
		textWithSprites('Enter your name', x, y, textZoom*1, 'CENTER');
	} else {
		let x = 0.5*width;
		let y = height * 0.1;
		textWithSprites('MASSIVE BOGGLE', x, y, textZoom*1.8, 'CENTER');
		if (Room.instance.state == 'rolling') {
			let x = 0.5*width;
			let y = height * 0.2;
			textWithSprites('tirage #' + Room.instance.game + '...', x, y, textZoom*1, 'CENTER');
		} else if (Room.instance.state == 'gaming') {
			let x = 0.5*width;
			let y = height * 0.2;
			textWithSprites('partie ' + '#' + Room.instance.game, x, y, textZoom*1, 'CENTER')
			Room.instance.displayGrid();
			stroke('white');
			fill('white');
			textFont('futura');
			textSize(30);
			x = width/2 - 95;
			y = height*0.8;
			textAlign(LEFT);
			text('>', x-20, height*0.8, width-40, height-40);
			text(inputWord, x, y, width-40, height-40);
			textAlign(CENTER);
			textSize(15)
			fill(...answerColor);
			stroke(...answerColor);
			text(answerMessage, width/2, height*0.9);
			//textWithSprites(answerMessage , width/2, height*0.9, textZoom*0.8, 'CENTER')
			Room.instance.displayScore();
			Room.instance.displayTime();
			Room.instance.displayRanks();
		} else if (Room.instance.state == 'ending') {
			let x = 0.5 * width;
			let y = height * 0.2;
			textWithSprites('resultat ' + '#' + Room.instance.game, x, y, textZoom*1, 'CENTER');
			textWithSprites(Room.instance.playerName + ' ' + (Room.instance.rankings[0].indexOf(Room.instance.playerName) + 1).toString() + '/' + Room.instance.rankings[0].length.toString(), x, y + 20, textZoom*1, 'CENTER');
			Room.instance.displayGrid();
			inputWord = '';
			answerMessage = '';
			Room.instance.displayTime();
			Room.instance.displaySolutions();
			Room.instance.displayRanks();
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
	if (Room.instance != undefined && Room.instance.state == 'gaming') {
		if (keyCode == BACKSPACE){
			inputWord = inputWord.substring(0, inputWord.length - 1);
			if (Room.instance.highlightedLetters.length > 0) Room.instance.highlightedLetters.pop();
			if (inputWord.length > 0) Room.instance.checkLettersToHighlight(inputWord);
		}
	}
}

function keyTyped(){
	if (Room.instance != undefined && Room.instance.state == 'gaming') {
		if (keyCode == ENTER) {
			if (inputWord.length <= 2) console.log('3 lettres mini');
			else socket.emit('newWord',inputWord, function(answer, word){[answerMessage, answerColor] = Room.instance.checkAnswer(answer, word)});
		} else if (keyCode != BACKSPACE && inputWord.length < 16) {
			inputWord += key;
			Room.instance.checkLettersToHighlight(inputWord);
		}
	}
}

function launchGame(){
	socket.emit('playGame', inputName.value(), function (id, state, game, grid, solutions, playerName){
					// create the map object
					removeElements();
					started = true;
					Room.instance = new Room(id, state, game, grid, solutions, playerName);
				});
}




