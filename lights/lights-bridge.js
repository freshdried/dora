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

var pub = zmq.socket('pub');
var pubport ='ipc:///tmp/lights-lights-pub.ipc';


dealer.connect(dealerport);
console.log("connected to port ", dealerport);

router.bind(routerport, function(err){
	if (err) throw err;
	pub.bind(pubport, start);
});

function start(err) {
	if (err) throw err;
	var Light = function(id) {
		var id = id;
		var state = 0;

		function changeState(newState) {
			var buf = new Buffer(1);
			buf[0] = (id<<1) + newState;
			dealer.send(buf);
			console.log('lights-bridge> Sent:', buf);
			state = newState;
			publishState();
		}

		function publishState() {
			var msg = {
				id: id,
				state: state
			}
			pub.send(JSON.stringify(msg));
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

		this.getState = function(envelope, output) {
			var msg = {
				id: id,
				state: state
			}
			router.send([envelope, output]);
			console.log('lights-bridge> returning:', output);
		}
		console.log("Light %s initialized!", id);
	}

	var light = [];
	for (var i = 0; i< 3; i ++) {
		light[i] = new Light(i);
		light[i].off();
	}

	router.on("message", function(envelope, data) {
		try {
			var obj = JSON.parse(data);
			console.log('lights-bridge> received from lights-client:', obj);
			light[obj.id][obj.command](envelope, data);
		} catch(e) {console.log(e);};
	});
}


