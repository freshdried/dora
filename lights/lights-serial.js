/*
 * lights-serial.js
 *
 * provides zmq socket (router) interface for serialport
 *
 * Outputs to serialport only. Does not read from serialport.
 *
 */
var zmq = require('zmq');
var SerialPort = require('serialport').SerialPort;

var router = zmq.socket('router');
var routerport = 'ipc:///tmp/lights-serial.ipc';

var spname = '/dev/ttyACM0';
var sp = new SerialPort(spname);

sp.on("open", function() {
	console.log("Serial Port opened on ", spname);
	router.bind(routerport, function(err) {
		router.on('message', function(envelope, data) {
			console.log('lights-serial> received from bridge:', data);
			sp.write(data);

			// //don't send back anything
			//socket.send([envelope, data])
		});
	});

});
