var zmq = require('zmq');
var util = require('util');
var events = require('events');

var dealer = zmq.socket('dealer');

var app = require('express')();
var serveStatic = require('serve-static');
app.use(serveStatic(__dirname + '/public'));

var server = require('http').Server(app);
var io = require('socket.io').listen(server);


dealer.connect('ipc:///tmp/dimming.router.ipc');
var Light = function() {
	//on: i= 0, off: i= 127
	var state = 127;
	this.emit('changeState', 127);

	this.setState = function(i) {
		if (!((typeof i) == 'number')) console.error('Cannot setState to not a number');

		if (i > 127) i = 127;
		if (i < 0) i = 0;

		state = i;
		this.emit('changeState', i);
	}
	this.getState = function(callback){
		//TODO: do not explode if callback is undefined
		callback(state);
	}

	this.on('changeState', function(i) {
		var buf = new Buffer([i]);
		dealer.send(buf);
	});
}
util.inherits(Light, events.EventEmitter)
var light = new Light();

//update everyone
light.on('changeState', function(i) {
	io.sockets.emit('changeState', i);
});

io.sockets.on('connection', function(socket) {
	socket.on('setState', function(data, callback) {
		light.setState(data);
	});
	socket.on('getState', function(data, callback) {
		light.getState(callback);
	});
});


server.listen(9005);

