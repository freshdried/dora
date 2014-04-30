var zmq = require('zmq');
var SerialPort = require('serialport').SerialPort;

var router = zmq.socket('router');
var routerport = 'ipc://lights-serial.ipc';

var spname = '/dev/ttyACM0';
var sp = new SerialPort(spname);

sp.on("open", function() {
	console.log("Serial Port opened on ", spname);
	router.bind(routerport, function(err) {
		router.on('message', function(envelope, data) {
			console.log('received:', data);
			sp.write(data);

			// //don't send back anything
			//socket.send([envelope, data])
		});
	});

});
