function preload() {
	fontSpriteSheet 		= loadImage("images/pixel_font_16x6.png");
}

function setup(){
	fontSprites = initSprite(fontSpriteSheet,16,6);
	fontTable=' !\"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_ abcdefghijklmnopqrstuvwxyz{|}~ çÜéÂAAçÊÊEÏÎIäaéAAÔÖOÛU';
	createCanvas(windowWidth,windowHeight);
	let inputName, playButton = enterYourName();
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
	let sInput = inputName.value();
	removeElements();
	enterYourName();
	inputName.value(inputName);
}

// utils
function initSprite(spriteSheet, wDIM, hDIM) {
	let imageList = [];
	let W = spriteSheet.width/wDIM;
	let H = spriteSheet.height/hDIM;
	for (let j = 0; j < hDIM; j++) {
		let y = j%hDIM*H;
		for (let i = 0; i < wDIM; i++) {
			let x = i%wDIM*W;
			imageList.push(spriteSheet.get(x, y, W, H));
		}
	}
	return imageList;
}

function textWithSprites(string, x, y, ratio, mode){
	let offset = 0;
	let reverse = 0;
	let textToTypeWithImage = arrayTextToType(string);
	if (mode == 'CENTER') offset = - textToTypeWithImage.length*8*ratio;
	if (mode == 'RIGHT') reverse = textToTypeWithImage.length;
	for (let i = 0; i < textToTypeWithImage.length; i++){
		image(textToTypeWithImage[i], x + offset + 16*ratio*(i-reverse), y, 16*ratio, 16*ratio);
	}
}

function arrayTextToType(str){
	let imageArray = [];
	for (const char of str){
		imageArray.push(fontSprites[fontTable.indexOf(char)]);
	}
	return imageArray;
}

function enterYourName() {
	inputName = createInput();
	inputName.center();
	// if player already have a name (from a previous game), prefill box with	
	let buttonRatio = 0.5;
	playButton = createButton('Play');
	playButton.position(width*0.5 - playButton.width*0.5, inputName.position().y + 30);
	return inputName, playButton;
}