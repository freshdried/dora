var zmq = require('zmq');
var SerialPort = require('serialport').SerialPort;

var router = zmq.socket('router');
var pub = zmq.socket('pub');
var routerport = 'ipc://serial-input.ipc';
var pubport = 'ipc://serial-output.ipc';

var spname = '/dev/ttyACM0';
var sp = new SerialPort(spname);

sp.on("open", function() {
	console.log("Serial Port opened on ", spname);
	pub.bind(pubport, function(err) {
		if (err) throw err;
		sp.on("data", function(data) {
			var output = fromSerial(data);
			pub.send(output);
		});
	});


	router.bind(routerport, function(err) {
		router.on('message', function(envelope, data) {
			var output = toSerial(data);
			sp.write(output);
			//socket.send([envelope, data]) //don't send back anything
		});
	});

});
function fromSerial(data) {
	var output = {
		id: data[0] >> 1,
		state: data[0] & 1
	}
	console.log("publishing:", output);
	return JSON.stringify(output);
}
function toSerial(data) {
	var obj = JSON.parse(data.toString());
	console.log("Received:", obj);
	var output = new Buffer(1);
	output[0] = (obj.id << 1) + obj.state;
	console.log("To Arduino:", output);
	return output;
}
