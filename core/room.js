var testing = (process.env.MODE == "testing");

var Sensory = require('./sensory')

var serialport = require("serialport");
var virtualserialport = require("./virtualserialport.js");

var express = require('express');
var connect = require('connect');
var app  = express();

app.use('/', connect.static('../web' + '/public'));

var server = require('http').createServer(app);

var io;
if (testing) io = require('socket.io').listen(server);
else io = require('socket.io').listen(server, {log: false});

var events = require('events');



require('./motor')({
	io: io.of('/motor'),
	sp: (function(){
		if (testing){ return new virtualserialport.motor(); };
		return new serialport.SerialPort("/dev/ttyUSB0",{
				parser: serialport.parsers.readline("\n"),
				baudrate: 9600
		});
	})(),
	devices: {
		'a': {
			code: 'A',
			type: 'Relay',
		},
		'b': {
			code: 'B',
			type: 'Relay',
		},
		'c': {
			code: 'C',
			type: 'Relay',
		},
	},
});
require('./sensory')({
	io: io.of('/sensory'),
	sp: (function(){
		if (testing) { return new virtualserialport.sensory(); };
		return new serialport.SerialPort("/dev/ttyACM0",{
				parser: serialport.parsers.readline("\n"),
				baudrate: 9600
		});
	})(),
	devices: {
		'remote': {
			code: 'R',
			type: 'Remote',
			name: 'My Remote',
			description: 'This is Sean\'s Remote Control',
		},
	},
});

server.listen(9001);
console.log('Core started at port 9001');
