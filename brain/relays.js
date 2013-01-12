var HIGH = 1;
var LOW = 0;

var state = {};
state['A'] = HIGH;
state['B'] = HIGH;
state['C'] = HIGH;


var toggle = function(write, triplet){
	var p = triplet[0];
	var message = triplet[state[p]];
	console.log(message);
	write(message, function(err, results){
	     console.log('err ' + err);
	     console.log('results ' + results);
	});
	state[p] = state[p]^1; //toggle (xor 1)
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


exports.toggleA = toggleA;
exports.toggleB = toggleB;
exports.toggleC = toggleC;

