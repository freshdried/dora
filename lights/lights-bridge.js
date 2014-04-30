/*
 * lights-bridge.js
 * 
 * abstracts lights from serial
 *
 * translates light requests as a router
 * to serial requests as a dealer
 *
 * links lights-client to lights-serial
 */

var zmq = require('zmq');
var dealer = zmq.socket('dealer');
var dealerport = 'ipc:///tmp/lights-serial.ipc';

var router = zmq.socket('router');
var routerport = 'ipc:///tmp/lights-lights.ipc';


dealer.connect(dealerport);
console.log("connected to port ", dealerport);

var Light = function(id) {
	var id = id;
	var state = 0;

	changeState(0);

	function changeState(newState) {
		var buf = new Buffer(1);
		buf[0] = (id<<1) + newState;
		dealer.send(buf);
		console.log('lights-serial-client> Sent:', buf);
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
		var msg = {
			id: id,
			state: state
		}
		return JSON.stringify(msg);
	}
	console.log("Light %s initialized!", id);
}

var light = [];
for (var i = 0; i< 3; i ++) {
	light[i] = new Light(i);
}

router.bind(routerport, function(err){
	router.on("message", function(envelope, data) {
		try {
			var obj = JSON.parse(data);
			console.log('lights-serial-client> received from lights-client:', obj);
			var output = light[obj.id][obj.command]();
			console.log('lights-serial-client> returning:', output);
			if (output){
				router.send([envelope, output]);
			}
		} catch(e) {console.log(e);};
	});
});

