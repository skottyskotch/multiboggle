function preload() {
	fontSpriteSheet 		= loadImage("images/pixel_font_16x6.png");
}

function setup(){
	fontSprites = initSprite(fontSpriteSheet,16,6);
	fontTable=' !\"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_ abcdefghijklmnopqrstuvwxyz{|}~ çÜéÂAAçÊÊEÏÎIäaéAAÔÖOÛU';
	createCanvas(windowWidth,windowHeight);
	started = false;
	//let inputName = enterYourName();
	inputName = createInput();
	inputName.center();
	playButton = createButton('Play');
	playButton.position(width*0.5 - playButton.width*0.5, inputName.position().y + 30);
	playButton.mousePressed(launchGame);
	socket = io.connect('http://localhost:3000');
	socket.on('hello', (defaultPlayerName) => {inputName.value(defaultPlayerName);})
}

function draw(){
	background(0);
	if (started == false) {
		let x = 0.5*width;
		let y = height * 0.25 - 20;
		textWithSprites('MASSIVE BOGGLE', x, y, 1.8, 'CENTER');

		y = height * 0.5 - 40;
		textWithSprites('Enter your name', x, y, 1, 'CENTER');
	} else {
		let x = 0.5*width;
		let y = height * 0.25 - 20;
		textWithSprites('MASSIVE BOGGLE', x, y, 1.8, 'CENTER');

	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	inputName.center();
	playButton.position(width*0.5 - playButton.width*0.5, inputName.position().y + 30);
}

function launchGame(){
	console.log('playGame: ' + inputName.value());
	socket.emit('playGame', inputName.value(), function (WelcomeData){
					// create the map object
					removeElements();
					started = true;
				});
}