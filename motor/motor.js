var serialport = require("serialport");
var sp = new serialport.SerialPort("/dev/ttyUSB0",{
	parser: serialport.parsers.readline("\n"),
	baudrate: 9600
});
//TODO: Add some inheritance from a general device object
var device = {
	Relay: function(letter){
		//private
		this.messages = [letter.toLowerCase(), letter.toUpperCase()];
		this.state = this.messages.indexOf(letter);
		this.write = function(newstate){
			sp.write(this.messages[newstate]);
			//console.log(newstate);
			//Log to external file
			this.state = newstate;
		}
		this.write(this.state); //initial state
		var self = this;
		console.log(this.messages);

		//public
		return {
			getstate: function(){ return self.state },
			toggle: function(){ self.write(self.state^1) },
			on: function(){ self.write(1) },
			off: function(){ self.write(0) },
		}
	},
};

sp.on("open", function(){
	var relays = {
		'a': new device.Relay('A'),
		'b': new device.Relay('B'),
		'c': new device.Relay('C'),
	}

	//read just in case
	sp.on('data', function(data){
		console.log("SERIAL: " + data);
	});
});


sp.on("close", function(){
	console.log('close');
});
