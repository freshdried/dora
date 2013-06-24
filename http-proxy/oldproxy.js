var httpProxy = require('http-proxy');
var connect = require('connect');

connect.createServer(
	connect.logger(),
	connect.static('../control-panel' + '/public')
).listen(9003);
var options = {
	pathnameOnly: true,
	router: {
		'/motor': '127.0.0.1:9001',
		'/sensory': '127.0.0.1:9002',
		'/control-panel': '127.0.0.1:9003',
	}
}
var proxy = httpProxy.createServer(options).listen(9000);
