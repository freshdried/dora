var zmq = require('zmq');
var sock = zmq.socket('dealer');
var port = 'ipc://serial-input.ipc'

sock.connect(port);

setInterval(function() {
	var num = Math.floor(Math.random() * 6);
	var obj = {
		'id': num >> 1,
		'state':  num & 1
	};
	sock.send(JSON.stringify(obj));
	console.log("Sent:", obj);
}, 1000);
