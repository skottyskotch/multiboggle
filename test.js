const { setTimeout: setTimeoutPromiseBased } = require('timers/promises');

var i = 0;
setInterval(function(){
	i++;
	console.log(i);
	(async function() {
		var delay = Math.floor(Math.random()*4000);
		console.log('  will wait ' + delay);
		await setTimeoutPromiseBased(delay);
		console.log('  done');
	})();
},5000);