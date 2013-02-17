var fs = require('fs');

var ON = 1;
var OFF = 0;

var state = {};

var lights = ['A','B','C']
for( var a in lights){
	state[lights[a]] = ON;
}
state['anylight'] = ON;
console.log(state);

var lightlog = function(){
	var tempany = new function(){
		for (var a in lights){
			if (state[a[lights]])
				return 1;
		}
		return 0;
	};
	if (tempany !== state['anylight']){
		state['anylight'] = tempany;
		var entry = 
			(new Date()).getTime() +
			" " + state['anylight'] + "\n";
		fs.appendFile('light.log', entry, function(err){
			if(err) throw err;
		});
	}
}

lightlog();


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

