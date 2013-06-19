var serialport = require("serialport");

var SerialPort = serialport.SerialPort;
var sp = new SerialPort("/dev/ttyUSB0",{
	parser: serialport.parsers.readline("\n"),
	baudrate: 9600
});
var Relay = function(letter){
	//private
	this.messages = [letter.toLowerCase(), letter.toUpperCase()];
	this.state = this.messages.indexOf(letter);
	this.write = function(newstate){
		sp.write(newstate);
		console.log(newstate);
		this.state = newstate;
	}
	this.write(this.state); //initial state
	var self = this;

	//public
	return {
		getstate: function(){ return self.state },
		toggle: function(){ self.write(self.state^1) },
		on: function(){ self.write(1) },
		off: function(){ self.write(0) },
	}

	
}
relayA = new Relay('A');
relayB = new Relay('B');
relayC = new Relay('C');

//read just in case
sp.on("open", function(){
	sp.on('data', function(data){
		console.log("SERIAL: " + data);
	});
});


sp.on("close", function(){
	console.log('close');
});
