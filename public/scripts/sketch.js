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
	inputName.value('Anon');
	playButton = createButton('Play');
	playButton.position(width*0.5 - playButton.width*0.5, inputName.position().y + 30);
	playButton.mousePressed(launchGame);
}

function draw(){
	background(0);
	let x = 0.5*width;
	let y = height * 0.25 - 20;
	textWithSprites('MASSIVE BOGGLE', x, y, 1.8, 'CENTER');

	y = height * 0.5 - 40;
	textWithSprites('Enter your name', x, y, 1, 'CENTER');
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	inputName.center();
	playButton.position(width*0.5 - playButton.width*0.5, inputName.position().y + 30);
}

function launchGame(){
	console.log('GO');
}