var Sensory = require('./sensory')

var serialport = require("serialport");
var virtualserialport = require("./virtualserialport.js");

var express = require('express');
var app  = express();

app.use('/', express.static('../shell' + '/public'));
app.use('/core-client', express.static('../core-client' + '/public'));

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var events = require('events');


var testing = (process.env.MODE != "production");

require('./motor')({
	io: io.of('/motor'),
	sp: (function(){
		if(testing) return new virtualserialport.motor();
		else return new serialport.serialport("/dev/ttyUSB0",{
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
		if(testing) return new virtualserialport.sensory();
		else return new serialport.serialport("/dev/ttyACM0",{
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

server.listen(9000);
console.log('Core started at port 9000');
