var events = require('events');
var util = require('util');

var VirtualSerialPort = function(){
	events.EventEmitter.call(this);
	(function(self){
		setTimeout(function(){
			self.emit("open");
		}, 100);
	})(this);

	this.write = function(data){
		console.log("sp.write: " + data);
	}
}
util.inherits(VirtualSerialPort, events.EventEmitter);

exports.motor = function(){
	VirtualSerialPort.call(this);
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
	})(this);
}
util.inherits(exports.sensory, VirtualSerialPort);

