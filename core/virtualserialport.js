var events = require('events');
var util = require('util');

var debug = (process.env.MODE != "production");

var VirtualSerialPort = function(){
	events.EventEmitter.call(this);
	(function(self){
		setTimeout(function(){
			self.emit("open");
		}, 100);
	})(this);
	this.write = function(){};

}
util.inherits(VirtualSerialPort, events.EventEmitter);

exports.motor = function(){
	VirtualSerialPort.call(this);

	this.write = function(data){
		if (debug) console.log("motor: to serial: " + data);
	}
}
util.inherits(exports.motor, VirtualSerialPort);

exports.sensory = function(){
	VirtualSerialPort.call(this);

	(function(self){
		var message = ['R401','R10401'];
		var bit = 0;

		var beep = function(){
			var id = setInterval(function(){
				self.emit('data',message[bit]);
			},100);
			setTimeout(function(){
				clearInterval(id);
				bit = bit^1;
				setTimeout(beep, 10000);
			},1000);
		};
		beep();
		if(debug) self.on('data', function(data){
			console.log('sensory: from serial: ' + data.toString())
		});
	})(this);
}
util.inherits(exports.sensory, VirtualSerialPort);

