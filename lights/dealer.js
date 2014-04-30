var zmq = require('zmq');
var sock = zmq.socket('dealer');
var port = 'ipc://lights-serial.ipc'

sock.connect(port);
console.log("connected to port ", port);

var Light = function(id) {
	var id = id;
	var state = 0;

	changeState(0);

	function changeState(newState) {
		var buf = new Buffer(1);
		buf[0] = (id<<1) + newState;
		sock.send(buf);
		console.log('Sent:', buf);
		state = newState;
	}


	this.on = function() {
		changeState(1);
	}
	this.off = function() {
		changeState(0);
	}
	this.toggle = function() {
		changeState(state^1);
	}

	this.getState = function() {
		return state;
	}
	console.log("Light %s initialized!", id);
}

var light = [];
for (var i = 0; i< 3; i ++) {
	light[i] = new Light(i);
}

setInterval(function() {
	light[Math.floor(Math.random() * 3)].toggle();
}, 1000);
