var serialport = require("serialport");
var io = require("socket.io").listen(8081);

io.set('log level', 1);

var sp = new serialport.SerialPort("/dev/ttyUSB0",{
	parser: serialport.parsers.readline("\n"),
	baudrate: 9600
});

sp.on("open", function(){
	console.log("open");
	var Device = function(letter, info){
		info = info || {};
		this.id = letter;
		this.type = 'Device';
		this.name = info.name || "";
		this.description = info.description || "";
		this.location =  info.location || "";
	};
	var Relay = function(letter, info){
		Device.call(this, letter, info);
		var messages = [letter.toLowerCase(), letter.toUpperCase()];
		var state = messages.indexOf(letter);
		var write = function(newstate){
			sp.write(messages[newstate]);
			state = newstate;
		};
		write(state); //initial state

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
	io.sockets.on('connection', function(socket){
		socket.emit('info', devices);
		socket.on('message', function(msg){
			try{
				devices [msg.id] [msg.command] ();
			}catch(e){
				console.log(e);
			}


		});
	});

	sp.on('data', function(data){
		console.log("SERIAL: " + data);
	});
});


sp.on("close", function(){
	console.log('close');
	//implement error!
});
