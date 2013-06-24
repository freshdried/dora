var bouncy = require('bouncy');
var connect = require('connect');

connect.createServer(
	connect.logger(),
	connect.static('../control-panel' + '/public')
).listen(9003);

var proxyserver = bouncy(function(req, res, bounce){
	var split = req.url.split('/');
	var sub = split[1];

	console.log('#####');
	console.log(sub);
	console.log('/' + split.slice(2).join('/'));

	var stream;
	if (sub == 'motor'){
		bounce(9001);
	}
	else if (sub == 'sensory'){
		bounce(9002);
	}
	else if (sub == 'control-panel'){
		bounce(9003);
	}
	else {
		res.statusCode = 404;
		res.end('no such host');
	}
});

proxyserver.listen(9000);
