var zmq = require('zmq');

var dealer = zmq.socket('dealer');

var app = require('express')();
var serveStatic = require('serve-static');
app.use(serveStatic(__dirname + '/public'));

var server = require('http').Server(app);
var io = require('socket.io').listen(server);


dealer.connect('ipc:///tmp/dimming.router.ipc');
io.sockets.on('connection', function(socket) {
	socket.on('message', function(data, callback) {
		console.log('Received from socket.io: '+  data);
		var buf = new Buffer([data]);
		dealer.send(buf);
	});
});

server.listen(9005);

