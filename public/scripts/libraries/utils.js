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
