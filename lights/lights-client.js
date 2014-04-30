/*
 * lights-client.js
 * 
 * connects to lights via lights-bridge
 *
 * brings dealer to socket.io level
 *
 */
var zmq = require('zmq');
var dealer = zmq.socket('dealer');
var dealerport = 'ipc://lights-lights.ipc';

dealer.connect(dealerport);
console.log("connected to port", dealerport);

var app = require('express')();
var serveStatic = require('serve-static');

app.use(serveStatic(__dirname + '/public'));

var server = require('http').Server(app);
var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket) {
	socket.on('command', function(data) {
		console.log('lights-client> Received:', data);
		try {
			dealer.send(JSON.stringify(data));
		} catch(e) {console.log(e)};
	});
});

dealer.on('message', function(data){
	console.log('lights-client> received from lights-serial-client:', JSON.parse(data));
	io.sockets.emit('message', JSON.parse(data));

});


server.listen(9001);

