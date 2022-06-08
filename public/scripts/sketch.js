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
		this.scrollMaxSpeed = 10;
		this.leftPanelWidth = 150;
		this.leftScrollPos = 0;
		this.rightPanelWidth = 150;
		this.rightScrollPos = 0;
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
		this.leftScrollPos = 0;
		this.rightScrollPos = 0;
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

	checkAnswer(score, word, sketch) {
		var answerMessage = '';
		var answerColor = [204,51,0];
		if (score > 0) {
			answerColor = [51,153,255];
			this.score = score;
			this.found.push(word.toUpperCase());
			answerMessage = word.toUpperCase() + '   ' + sketch.str(score);
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

	displayGrid(sketch){
		// display the grid
		var squareLength = 50;
		var offset = 5;
		for (var i = 0; i < 4; i++){
			for (var j = 0; j < 4; j++){
				if (this.state == 'gaming') {
					sketch.stroke(255);
					if (this.highlightedLetters.indexOf(j*4+i) != -1) sketch.fill(100);
					else sketch.fill(0);
				}
				if (Room.instance.state == 'ending') {
					sketch.stroke(125)
					sketch.fill(25);
				}
				let x = sketch.width/2 -(squareLength*4+offset*3)/2 +(squareLength+offset)*i;
				let y = sketch.height/2-(squareLength*4+offset*3)/2 +(squareLength+offset)*j;
				sketch.square(x, y, squareLength);
				if (this.grid != 'ending') textWithSprites(this.grid[j][i], x+squareLength/2, y+squareLength/4, textZoom*2, 'CENTER', sketch);
			}
		}
	}

	displayScore(sketch){
		for (var word of this.found.sort().sort(function(a, b){return b.length - a.length;})) {
			textWithSprites(word, 10, 50 + this.found.indexOf(word) * 15 + this.leftScrollPos, textZoom * 0.8, 'LEFT', sketch);
			var wordScore = '';
			if (word.length == 3) wordScore = '1';
			else if (word.length == 4) wordScore = '1';
			else if (word.length == 5) wordScore = '2';
			else if (word.length == 6) wordScore = '3';
			else if (word.length == 7) wordScore = '5';
			else if (word.length >= 8) wordScore = '11';
			textWithSprites(wordScore, this.leftPanelWidth, 50 + this.found.indexOf(word) * 15 + this.leftScrollPos, textZoom * 0.8 , 'RIGHT', sketch);
		}
		sketch.noStroke();
		sketch.fill(0,100);
		sketch.rect(0, 0, this.leftPanelWidth, 25);
		textWithSprites(this.playerName + ' ' + this.score, 10, 10, textZoom*1, 'LEFT', sketch);
	}

	displaySolutions(sketch){
		for (var i = 0; i < this.solutions.length; i++){
			if (this.found.indexOf(this.solutions[i]) == -1) sketch.tint(100,100,100);
			else sketch.noTint()
			textWithSprites(this.solutions[i], 10, 50 + i*15 + this.leftScrollPos, textZoom*0.8, 'LEFT', sketch);
			var wordScore = 0;
			if (this.solutions[i].length == 3) wordScore = 1;
			else if (this.solutions[i].length == 4) wordScore = 1;
			else if (this.solutions[i].length == 5) wordScore = 2;
			else if (this.solutions[i].length == 6) wordScore = 3;
			else if (this.solutions[i].length == 7) wordScore = 5;
			else if (this.solutions[i].length >= 8) wordScore = 11;
			textWithSprites(wordScore.toString(), this.leftPanelWidth, 50 + i*15 + this.leftScrollPos, textZoom * 0.8, 'RIGHT', sketch);
		}
		sketch.noTint();
		sketch.noStroke();
		sketch.fill(0,100);
		sketch.rect(0, 0, this.leftPanelWidth, 25);
		textWithSprites('Total', 10, 10, textZoom*1, 'LEFT', sketch);
		textWithSprites(this.totalScore.toString(), this.leftPanelWidth, 10, textZoom*1, 'RIGHT', sketch);
	}

	displayTime(sketch){
		textWithSprites(this.time.toString(), sketch.width/2, 10, textZoom*1, 'CENTER', sketch);
	}

	displayRanks(sketch){
		for (var i = 0; i < this.rankings[0].length; i++){
			if (this.lastWinnerIndex != -1 && this.lastWinnerIndex == i) sketch.image(crownImage, sketch.width - 50 - (this.rankings[0][i].toString().length+1)*16-14, 25 + i*15 + 14, 28, 28);
			textWithSprites(this.rankings[1][i].toString(), sketch.width - 10, 50 + i*15 + this.rightScrollPos, textZoom*1, 'RIGHT', sketch);
			textWithSprites(this.rankings[0][i], sketch.width - this.rightPanelWidth, 50 + i*15 + this.rightScrollPos, textZoom*1, 'LEFT', sketch);
		}
		sketch.noStroke();
		sketch.fill(0,100);
		sketch.rect(sketch.width - this.rightPanelWidth, 0, this.rightPanelWidth, 25);
		textWithSprites('Classement', sketch.width - 10, 10, textZoom*1, 'RIGHT', sketch);
	}
}
Room.instance = undefined;

const mainSketch = ( sketch ) => {
	var mainCanvas;
	sketch.preload = () => {
		//fontSpriteSheet 		= loadImage("images/pixel_font_15x8.png");
		fontSpriteSheet 		= sketch.loadImage("images/pixel_font_16x6.png");
		crownImage 				= sketch.loadImage("images/crown1.png");
		//crownImage 				= loadImage("images/crown2.png");
		//crownImage 				= loadImage("images/crown3.png");		
	};

	sketch.setup = () => {
		textZoom = 0.8;
		fontSprites = initSprite(fontSpriteSheet,16,6);
		//fontSprites = initSprite(fontSpriteSheet,15,8);
		fontTable=' !\"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_ abcdefghijklmnopqrstuvwxyz{|}~ çÜéÂAAçÊÊEÏÎIäaéAAÔÖOÛU';
		mainCanvas = sketch.createCanvas(sketch.windowWidth,sketch.windowHeight);
		mainCanvas.position(0, 0);
    	mainCanvas.mouseWheel(sketch.doScroll);
		inputName = sketch.createInput();
		inputName.position(mainCanvas.position().x + mainCanvas.width * 0.5 - inputName.width*0.5, mainCanvas.height*0.5);
		playButton = sketch.createButton('Play');
		playButton.position(mainCanvas.position().x + mainCanvas.width*0.5 - playButton.width*0.5, inputName.position().y + 30);
		playButton.mousePressed(function() {
		socket.emit('playGame', inputName.value(), function (id, state, game, grid, solutions, playerName){
					// create the map object
					sketch.removeElements();
					started = true;
					Room.instance = new Room(id, state, game, grid, solutions, playerName);
				});
		});

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
	};

	sketch.draw = () => {
		sketch.background(0);
		if (Room.instance == undefined) {
			let x = 0.5 * sketch.width;
			let y = sketch.height * 0.25 - 20;
			textWithSprites('MASSIVE BOGGLE', x, y, textZoom*1.8, 'CENTER', sketch);
			y = sketch.height * 0.5 - 40;
			textWithSprites('Enter your name', x, y, textZoom*1, 'CENTER', sketch);
		} else {
			let x = 0.5 * sketch.width;
			let y = sketch.height * 0.1;
			textWithSprites('MASSIVE BOGGLE', x, y, textZoom*1.8, 'CENTER', sketch);
			if (Room.instance.state == 'rolling') {
				let x = 0.5 * sketch.width;
				let y = sketch.height * 0.2;
				textWithSprites('tirage #' + Room.instance.game + '...', x, y, textZoom*1, 'CENTER', sketch);
			} else if (Room.instance.state == 'gaming') {
				let x = 0.5 * sketch.width;
				let y = sketch.height * 0.2;
				textWithSprites('partie ' + '#' + Room.instance.game, x, y, textZoom*1, 'CENTER', sketch)
				Room.instance.displayGrid(sketch);
				sketch.stroke('white');
				sketch.fill('white');
				sketch.textFont('futura');
				sketch.textSize(30);
				x = sketch.width/2 - 95;
				y = sketch.height*0.8;
				sketch.textAlign(sketch.LEFT);
				sketch.text('>', x-20, sketch.height*0.8, sketch.width-40, sketch.height-40);
				sketch.text(inputWord, x, y, sketch.width-40, sketch.height-40);
				sketch.textAlign(sketch.CENTER);
				sketch.textSize(15)
				sketch.fill(...answerColor);
				sketch.stroke(...answerColor);
				sketch.text(answerMessage, sketch.width/2, sketch.height*0.9);
				Room.instance.displayScore(sketch);
				Room.instance.displayTime(sketch);
				Room.instance.displayRanks(sketch);
			} else if (Room.instance.state == 'ending') {
				let x = 0.5 * sketch.width;
				let y = sketch.height * 0.2;
				textWithSprites('resultat ' + '#' + Room.instance.game, x, y, textZoom*1, 'CENTER', sketch);
				textWithSprites(Room.instance.playerName + ' ' + (Room.instance.rankings[0].indexOf(Room.instance.playerName) + 1).toString() + '/' + Room.instance.rankings[0].length.toString(), x, y + 20, textZoom*1, 'CENTER', sketch);
				Room.instance.displayGrid(sketch);
				inputWord = '';
				answerMessage = '';
				Room.instance.displaySolutions(sketch);
				Room.instance.displayTime(sketch);
				Room.instance.displayRanks(sketch);
			}
		};
	};

	sketch.windowResized = () => {
		sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
		mainCanvas.position(0, 0);
		if (Room.instance == undefined) {
			inputName.position(mainCanvas.position().x + mainCanvas.width * 0.5 - inputName.width*0.5, mainCanvas.height*0.5);
			playButton.position(mainCanvas.position().x + mainCanvas.width * 0.5 - playButton.width*0.5, inputName.position().y + 30);
		}
	};

	sketch.keyPressed = () => {
		if (Room.instance != undefined && Room.instance.state == 'gaming') {
			if (sketch.keyCode == sketch.BACKSPACE){
				inputWord = inputWord.substring(0, inputWord.length - 1);
				if (Room.instance.highlightedLetters.length > 0) Room.instance.highlightedLetters.pop();
				if (inputWord.length > 0) Room.instance.checkLettersToHighlight(inputWord);
			}
		}
	};

	sketch.keyTyped = () => {
		if (Room.instance != undefined && Room.instance.state == 'gaming') {
			if (sketch.keyCode == sketch.ENTER) {
				if (inputWord.length <= 2) console.log('3 lettres mini');
				else socket.emit('newWord',inputWord, function(answer, word){[answerMessage, answerColor] = Room.instance.checkAnswer(answer, word, sketch)});
			} else if (sketch.keyCode != sketch.BACKSPACE && inputWord.length < 16) {
				inputWord += sketch.key;
				Room.instance.checkLettersToHighlight(inputWord);
			}
		}
	}

	sketch.doScroll = function(event) {
		if (Room.instance != undefined) {
			if (sketch.mouseX < Room.instance.leftPanelWidth) {
				let scrollStep = sketch.constrain(event.deltaY, -Room.instance.scrollMaxSpeed, Room.instance.scrollMaxSpeed);
				Room.instance.leftScrollPos += scrollStep;
				leftScrollMin = 0;
				if (Room.instance.state == 'gaming') {
					if (50 + Room.instance.found.length * 15 > sketch.height) leftScrollMin = sketch.height - 50 - Room.instance.found.length * 15;
				} else if (Room.instance.state == 'ending') {
					if (50 + Room.instance.solutions.length * 15 > sketch.height) leftScrollMin = sketch.height - 50 - Room.instance.solutions.length * 15;
				}
				Room.instance.leftScrollPos = sketch.constrain(Room.instance.leftScrollPos, leftScrollMin, 0);
			} else if (sketch.mouseX > sketch.width - Room.instance.rightPanelWidth){
				let scrollStep = sketch.constrain(event.deltaY, -Room.instance.scrollMaxSpeed, Room.instance.scrollMaxSpeed);
				Room.instance.rightScrollPos += scrollStep;
				rightScrollMin = 0;
				if (Room.instance.state == 'gaming') {
					if (50 + Room.instance.rankings[0].length * 15 > sketch.height) rightScrollMin = sketch.height - 50 - Room.instance.rankings[0].length * 15;
				} else if (Room.instance.state == 'ending') {
					if (50 + Room.instance.rankings[0].length * 15 > sketch.height) rightScrollMin = sketch.height - 50 - Room.instance.rankings[0].length * 15;
				}
				Room.instance.rightScrollPos = sketch.constrain(Room.instance.rightScrollPos, rightScrollMin, 0);
			}
		}
	}
};

/*const leftSketch = ( sketch ) => {
	sketch.preload = () => {
		//fontSpriteSheet 		= loadImage("images/pixel_font_15x8.png");
		fontSpriteSheet 		= sketch.loadImage("images/pixel_font_16x6.png");	
	};

	sketch.setup = () => {
		textZoom = 0.8;
		fontSprites = initSprite(fontSpriteSheet,16,6);
		//fontSprites = initSprite(fontSpriteSheet,15,8);
		fontTable=' !\"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_ abcdefghijklmnopqrstuvwxyz{|}~ çÜéÂAAçÊÊEÏÎIäaéAAÔÖOÛU';
		leftCanvas = sketch.createCanvas(leftPanelWidth, sketch.windowHeight*0.25);
		leftCanvas.position(0, sketch.windowHeight*0.5, 'absolute');
    	leftCanvas.mouseWheel(sketch.doScroll);
	};

	sketch.draw = () => {
		sketch.background(40);
		if (Room.instance == undefined) {
		} else {
			if (Room.instance.state == 'rolling') {
			} else if (Room.instance.state == 'gaming') {
				Room.instance.displayScore(sketch);
			} else if (Room.instance.state == 'ending') {
				Room.instance.displaySolutions(sketch);
			}
		};
	};

	sketch.windowResized = () => {
		sketch.resizeCanvas(leftPanelWidth, sketch.windowHeight);
		leftCanvas.position(0, 0);
	};	

	sketch.doScroll = function(event) {
		scrollStep = sketch.constrain(event.deltaY, -scrollMaxSpeed, scrollMaxSpeed);
		scrollPos += scrollStep;
		//scrollPos = sketch.constrain(scrollPos, scrollPosMin, scrollPosMax) // top/bottom margin stops
	}
}

const rightSketch = ( sketch ) => {
	sketch.preload = () => {
		//fontSpriteSheet 		= loadImage("images/pixel_font_15x8.png");
		fontSpriteSheet 		= sketch.loadImage("images/pixel_font_16x6.png");	
	};

	sketch.setup = () => {
		textZoom = 0.8;
		scrollMaxSpeed = 10;
		scrollPos = 0;
		fontSprites = initSprite(fontSpriteSheet,16,6);
		//fontSprites = initSprite(fontSpriteSheet,15,8);
		fontTable=' !\"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_ abcdefghijklmnopqrstuvwxyz{|}~ çÜéÂAAçÊÊEÏÎIäaéAAÔÖOÛU';
		rightCanvas = sketch.createCanvas(rightPanelWidth + 5, sketch.windowHeight);
		rightCanvas.position(sketch.windowWidth - rightPanelWidth - 5, 0);
    	rightCanvas.mouseWheel(sketch.doScroll);
	};

	sketch.draw = () => {
		sketch.background(0);
		sketch.fill(255);
		sketch.translate(0, scrollPos);
  		sketch.rect(10, 10, 50, 50);
		if (Room.instance != undefined) {
			if (Room.instance.state == 'gaming') {
				Room.instance.displayRanks(sketch);
			} else if (Room.instance.state == 'ending') {
			}
		};
	};

	sketch.windowResized = () => {
		sketch.resizeCanvas(rightPanelWidth + 5, sketch.windowHeight);
		rightCanvas.position(sketch.windowWidth - rightPanelWidth - 5, 0);
	};

	sketch.doScroll = function(event) {
		if (sketch.mouseX < leftPanelWidth) {
			let scrollStep = sketch.constrain(event.deltaY, -scrollMaxSpeed, scrollMaxSpeed);
			leftScrollPos += scrollStep;
			leftScrollPos = sketch.constrain(leftScrollPos, 0, 10);
		} else if (sketch.mouseY > rightPanelWidth){
			let scrollStep = sketch.constrain(event.deltaY, -scrollMaxSpeed, scrollMaxSpeed);
			rightScrollPos += scrollStep;
			rightScrollPos = sketch.constrain(leftScrollPos, 0, 10);
		}
	}
}*/

let mainP5 = new p5(mainSketch);
//let leftP5 = new p5(leftSketch);
//let rightP5 = new p5(rightSketch);