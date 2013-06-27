var express = require('express');
var app  = express();

app.use('/', express.static('./shell'));

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var events = require('events');

var mode = process.env.MODE || "testing"
if (mode == "production"){
	var serialport = require("serialport");
	require('./motor')({
		io: io.of('/motor'),
		sp: new serialport.SerialPort("/dev/ttyUSB0",{
			parser: serialport.parsers.readline("\n"),
			baudrate: 9600
		})
	});

	require('./sensory')({
		io: io.of('/sensory'),
		sp: new serialport.SerialPort("/dev/ttyACM0",{
			parser: serialport.parsers.readline("\n"),
			baudrate: 9600
		})
	});
}
else {
	var virtualserialport = require("./virtualserialport.js");
	require('./motor')({
		io: io.of('/motor'),
		sp: new virtualserialport.motor()
	});
	require('./sensory')({
		io: io.of('/sensory'),
		sp: new virtualserialport.sensory()
	});
}

server.listen(9000);
console.log('Server started at port 9000');
