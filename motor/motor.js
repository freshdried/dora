var serialport = require("serialport");
var io = require("socket.io").listen(8081);

var sp = new serialport.SerialPort("/dev/ttyUSB0",{
	parser: serialport.parsers.readline("\n"),
	baudrate: 9600
});

//TODO: Add some inheritance from a general device object

sp.on("open", function(){
	var Device = function(letter, info){
		info = info || {};
		this.type = 'Device';
		this.name = info.name || "";
		this.description = info.description || "";
		this.location =  info.location || "";
	};
	//FIX PROTOTYPE STUFF
	var Relay = function(letter, info){
		//this.prototype = new Device(letter, info);
		Relay.prototype = new Device(letter, info);

		var messages = [letter.toLowerCase(), letter.toUpperCase()];
		var state = messages.indexOf(letter);
		var write = function(newstate){
			sp.write(messages[newstate]);
			//console.log(newstate);
			//Log to external file
			state = newstate;
		};
		write(state); //initial state
		console.log(messages);

		this.type =  'Relay';
		this.getstate =  function(){ return state };
		this.toggle =  function(){ write(state^1) };
		this.on = function(){ write(1) };
		this.off = function(){ write(0) };
				
	};
	var devices = {
		'a': new Relay('A'),
		'b': new Relay('B'),
		'c': new Relay('C'),
	}
	setInterval(function(){
		devices.a.toggle();
	}, 1000);
	io.sockets.on('connection', function(socket){
		socket.emit('welcome', "Hello World!");
		socket.emit('welcome', devices);
	});

	sp.on('data', function(data){
		console.log("SERIAL: " + data);
	});
});


sp.on("close", function(){
	console.log('close');
});
