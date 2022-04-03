import random, unicodedata, sys, time

def initDict():
	print 'retrieve the list of words'
	with open("/Users/falcou/Alex/Prog/boggle/dict_concat_fr.csv", 'r') as fp:
	    for count, line in enumerate(fp):
	    	word = unicodedata.normalize('NFD',unicode(line,'utf-8')).encode('ascii','ignore').strip().upper()
	    	if len(word) > 2 and len(word) < 17:
		    	if len(word) in wordDict:
		    		wordDict[len(word)].append(word)
		    	else:
		    		wordDict[len(word)] = [word]
	print 'optimization'
	with open("/Users/falcou/Alex/Prog/boggle/dict_concat_fr.csv", 'r') as fp:
	    for count, line in enumerate(fp):
	    	word = unicodedata.normalize('NFD',unicode(line,'utf-8')).encode('ascii','ignore').strip().upper()
	    	if len(word) < 17:
		    	for i in range(1+len(word)-1):
		    			wordBits[word[0:i]] = ""

def searchInWordDict(str):
	if len(str) > 2 and str in wordDict[len(str)]:
		solutions.append(str)
		return True
	if str in wordBits.keys():
		return True

def recurse(i, j, testedPositions):
	chars = ''.join([grid[x][y] for (x,y) in testedPositions]) + grid[i][j]
#	print 'searching ' + chars + '(' + str(testedPositions) + ') (' + str(i) + ',' + str(j) + ')' 
	found = searchInWordDict(chars)
	if found:
		testedPositions.append((i,j))
		if i != 0 and j != 0 and (i-1,j-1) not in testedPositions:
			recurse(i-1, j-1, testedPositions)
		if            j != 0 and (i  ,j-1) not in testedPositions:
			recurse(i  , j-1, testedPositions)
		if i != 3 and j != 0 and (i+1,j-1) not in testedPositions:
			recurse(i+1, j-1, testedPositions)
		if i != 0            and (i-1,j  ) not in testedPositions:
			recurse(i-1, j  , testedPositions)
		if i != 3            and (i+1,j  ) not in testedPositions:
			recurse(i+1, j  , testedPositions)
		if i != 0 and j != 3 and (i-1,j+1) not in testedPositions:
			recurse(i-1, j+1, testedPositions)
		if            j != 3 and (i  ,j+1) not in testedPositions:
			recurse(i  , j+1, testedPositions)
		if i != 3 and j != 3 and (i+1,j+1) not in testedPositions:
			recurse(i+1, j+1, testedPositions)
		testedPositions.pop()

def initGrid():
	diceToThrow = dices.keys()
	i = 0
	row = []
	for throw in range(len(dices.keys())):
		i+=1
		dice = random.choice(diceToThrow)
		diceToThrow.remove(dice)
		row.append(random.choice(dices[dice]))
		if i == 4:
			grid.append(row)
			row = []
			i = 0

def findSolutions():
	startTime = time.time()
	for i in range(gridHeight):
		for j in range(gridWidth):
			print "recurse for " + str(i) + "," + str(j) + ": " + grid[i][j]
			testedPositions = []
			recurse(i,j,testedPositions)
	endTime = time.time()
	print 'solution found in ' + str(endTime - startTime)

def sortSolution(solutions):
	result = []
	temp = {}
	for sol in solutions:
		if len(sol) in temp:
			temp[len(sol)].append(sol)
		else:
			temp[len(sol)] = [sol]
	for solKey in sorted(temp, reverse = True):
		result.extend(sorted(dict.fromkeys(temp[solKey])))
	return result

def main():
	initDict()
	initGrid()
	findSolutions()
	for solution in sortSolution(solutions):
		print solution
	for row in grid:
		print(",".join(row))

if __name__ == '__main__':
	gridWidth = 4
	gridHeight = 4
	minWordLength = 3
	grid = []
	wordDict = {}
	wordBits = {}
	solutions = []
	dices = dict(D1 = ["E","T","U","K","N","O"],
	D2 = ["E","V","G","T","I","N"],
	D3 = ["D","E","C","A","M","P"],
	D4 = ["I","E","L","R","U","W"],
	D5 = ["E","H","I","F","S","E"],
	D6 = ["R","E","C","A","L","S"],
	D7 = ["E","N","T","D","O","S"],
	D8 = ["O","F","X","R","I","A"],
	D9 = ["N","A","V","E","D","Z"],
	D10 = ["E","I","O","A","T","A"],
	D11 = ["G","L","E","N","Y","U"],
	D12 = ["B","M","A","Q","J","O"],
	D13 = ["T","L","I","B","R","A"],
	D14 = ["S","P","U","L","T","E"],
	D15 = ["A","I","M","S","O","E"],
	D16 = ["E","N","H","R","I","S"])
	main()




