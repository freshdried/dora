var zmq = require('zmq');

var sock = zmq.socket('sub');
var port = 'ipc://serial-output.ipc';

sock.connect(port);
sock.subscribe('');
sock.on('message', function(data) {
	console.log(data);
});
