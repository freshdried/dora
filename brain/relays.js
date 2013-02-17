var fs = require('fs');

var ON = 1;
var OFF = 0;

var state = {};
state['A'] = ON;
state['B'] = ON;
state['C'] = ON;
state['any'] = ON;

var lightlog = function(){
	var tempany = state['A'] | state['B'] | state['C'];
	console.log(tempany + "   " + state['any']);
	if (tempany !== state['any']){
		state['any'] = tempany;
		var entry = 
			(new Date()).getTime() +
			" " + state['any'] + "\n";
		fs.appendFile('light.log', entry, function(err){
			if(err) throw err;
		});
	}
}


var toggle = function(write, triplet){
	var p = triplet[0];
	var message = triplet[state[p]];
	console.log(message);
	write(message, function(err, results){
	     console.log('err ' + err);
	     console.log('results ' + results);
	});
	state[p] = state[p]^1; //toggle (xor 1)
	lightlog();
};

var toggleA = function(write){
	toggle(write, ['A','a']);
};
var toggleB = function(write){
	toggle(write, ['B','b']);
};
var toggleC = function(write){
	toggle(write, ['C','c']);
};
var toggleAll = function(write){
	toggleA(write);
	toggleB(write);
	toggleC(write);
};


exports.toggleA = toggleA;
exports.toggleB = toggleB;
exports.toggleC = toggleC;
exports.toggleAll = toggleAll;

