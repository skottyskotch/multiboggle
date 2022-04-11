fs = require('fs');

console.log(initDict());
function initDict(){
	fs.readFile('resource/dict_concat_fr.csv', 'utf8', function (err,data) {
		let wordDict = {};
		if (err) {
			return console.log(err);
		}
		for (const word of data.split('\n')){
			if (word.length > 2 && word.length < 17 && word.indexOf('-') == -1) {
				if (wordDict[word.length] != undefined) wordDict[word.length].push(word.normalize("NFD").replace(/\p{Diacritic}/gu, "").toUpperCase());
				else wordDict[word.length] = [word.normalize("NFD").replace(/\p{Diacritic}/gu, "").toUpperCase()];
			}
		}
		//console.log(wordDict);
		return wordDict;
	});
}