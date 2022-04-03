import unicodedata
wordDict = {}
keyToKeep = [3,4,5,6,7,8,9,10,11,12,13,14,15,16]
with open("/Users/falcou/Alex/Prog/boggle/dict_concat_fr.csv", 'r') as fp:
    for count, line in enumerate(fp):
    	word = unicodedata.normalize('NFD',unicode(line,'utf-8')).encode('ascii','ignore').strip()
    	if len(word) > 2 and len(word) < 17:
	    	if len(word) in wordDict:
	    		wordDict[len(word)].append(word.upper())
	    	else:
	    		wordDict[len(word)] = [word.upper()]

optim = {}
with open("/Users/falcou/Alex/Prog/boggle/dict_concat_fr.csv", 'r') as fp:
    for count, line in enumerate(fp):
    	word = unicodedata.normalize('NFD',unicode(line,'utf-8')).encode('ascii','ignore').strip()
    	if len(word) < 17:
	    	for i in range(1+len(word)-1):
	    			optim[word[0:i]] = ""

print len(wordDict.keys())
print len(optim.keys())
