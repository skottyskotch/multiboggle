const fs = require('fs');

var dices = {
		D1  : ["E","T","U","K","N","O"],
		D2  : ["E","V","G","T","I","N"],
		D3  : ["D","E","C","A","M","P"],
		D4  : ["I","E","L","R","U","W"],
		D5  : ["E","H","I","F","S","E"],
		D6  : ["R","E","C","A","L","S"],
		D7  : ["E","N","T","D","O","S"],
		D8  : ["O","F","X","R","I","A"],
		D9  : ["N","A","V","E","D","Z"],
		D10 : ["E","I","O","A","T","A"],
		D11 : ["G","L","E","N","Y","U"],
		D12 : ["B","M","A","Q","J","O"],
		D13 : ["T","L","I","B","R","A"],
		D14 : ["S","P","U","L","T","E"],
		D15 : ["A","I","M","S","O","E"],
		D16 : ["E","N","H","R","I","S"]};

function initDict(){
	var data = fs.readFileSync('resource/dict_concat_fr.csv', 'utf8')
	var wordDict = {};
	for (const word of data.split('\n')){
		if (word.length > 2 && word.length < 17 && word.indexOf('-') == -1) {
			if (wordDict[word.length] != undefined) wordDict[word.length].push(word.normalize("NFD").replace(/\p{Diacritic}/gu, "").toUpperCase());
			else wordDict[word.length] = [word.normalize("NFD").replace(/\p{Diacritic}/gu, "").toUpperCase()];
		}
	}
	return wordDict;
}

function initGrid(){
	var grid = [];
	var diceToThrow = Object.keys(dices).sort(() => Math.random() - 0.5);
	var i = 0;
	var row = [];
	for (var dice of diceToThrow){
		i++;
		row.push(dices[dice][Math.floor(Math.random()*6)]);
		if (i == 4){
			grid.push(row);
			row = [];
			i = 0;
		}
	}
	return grid;
}

function initWordRoots(wordList){
	var wordBits = {};
	for (var sWordLength of Object.keys(wordList)){
		//console.log('1:' + sWordLength);
		for (var sWord of wordList[sWordLength]){
			//console.log('2:' + sWord);
			for (var i = 1; i < sWord.length; i++){
			//console.log('3:' + sWord.substring(0,i));
				wordBits[sWord.substring(0,i)] = '';
			}
		}
	}
	return Object.keys(wordBits);
}

function searchInWordDict(str, aSolutions){
	if (str.length > 2 && wordList[str.length].indexOf(str) != -1){
		aSolutions.push(str);
		return true;
	}
	if (wordRootsList.indexOf(str) != -1) return true;
	return false;
}

function recurse(i, j, testedPositions, aSolutions){
	var sChars = '';
	for (var eachCoord of testedPositions) {			// testedPositions is a list of strings ['1:1','3:2',...]
		sChars += grid[eachCoord[0]][eachCoord[2]];
	}
	sChars += grid[i][j];
	//console.log('searching ' + sChars + '(' + testedPositions + ') (' + i + ':' + j + ')'); 
	var found = searchInWordDict(sChars, aSolutions);
	if (found){
		testedPositions.push(i.toString()+':'+j.toString());
		if (i != 0 && j != 0 && testedPositions.indexOf(String(i-1)+':'+String(j-1)) == -1)	recurse(i-1, j-1, testedPositions, aSolutions);
		if (          j != 0 && testedPositions.indexOf(String(i  )+':'+String(j-1)) == -1)	recurse(i  , j-1, testedPositions, aSolutions);
		if (i != 3 && j != 0 && testedPositions.indexOf(String(i+1)+':'+String(j-1)) == -1)	recurse(i+1, j-1, testedPositions, aSolutions);
		if (i != 0           && testedPositions.indexOf(String(i-1)+':'+String(j  )) == -1)	recurse(i-1, j  , testedPositions, aSolutions);
		if (i != 3           && testedPositions.indexOf(String(i+1)+':'+String(j  )) == -1)	recurse(i+1, j  , testedPositions, aSolutions);
		if (i != 0 && j != 3 && testedPositions.indexOf(String(i-1)+':'+String(j+1)) == -1)	recurse(i-1, j+1, testedPositions, aSolutions);
		if (          j != 3 && testedPositions.indexOf(String(i  )+':'+String(j+1)) == -1)	recurse(i  , j+1, testedPositions, aSolutions);
		if (i != 3 && j != 3 && testedPositions.indexOf(String(i+1)+':'+String(j+1)) == -1)	recurse(i+1, j+1, testedPositions, aSolutions);
		testedPositions.pop();
	}
}

function findSolutions(){
	var tempSolutions = [];
	var startTime = Date.now();
	for (var i = 0; i < 4; i++){
		for (var j = 0; j < 4; j++){
			console.log("recurse for " + i + "," + j + ": " + grid[i][j]);
			var testedPositions = [];
			recurse(i,j,testedPositions,tempSolutions);
		}
	}
	var endTime = Date.now();
	console.log(tempSolutions.length + ' words found in ' + String(endTime - startTime));
	var dSolutions = {};
	for (var sol of tempSolutions){
		dSolutions[sol] = '';
	}
	return Object.keys(dSolutions);
}

function sortSolution(aSolutions){
	var dSolByLength = {};
	for (var sol of aSolutions){
		if (dSolByLength[sol.length] != undefined) dSolByLength[sol.length].push(sol);
		else dSolByLength[sol.length] = [sol];
	}
	var result = [];
	for (var solLength of Object.keys(dSolByLength).sort(function(a, b){return b - a;})){
		result.push(...dSolByLength[solLength].sort());
	}
	return result;
}

function boggle() {
	var wordList = initDict();
	var wordRootsList = initWordRoots(wordList);
	var grid = initGrid();
	var solutions = sortSolution(findSolutions());
	for (var solution of solutions){
		console.log(solution);
	}
	for (var row of grid){
		console.log(row.join(','));
	}
	return {'grid':grid, 'solutions': solutions};
}
