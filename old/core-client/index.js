var io = require('socket.io-client');
var EventEmitter = require('events').EventEmitter;
//todo: debug mode?

var Motor = function(settings){
	var motor = this;
	var core = settings.core;

	this.io = settings.io;
	this.io.on('connect', function(){
		console.log('connected to motor!');
	});
	this.devices = {};

	this.io.on('info', function(data){
		for (id in data.devices){
			var d = data.devices[id];
			var device = {};
			device.name = d.name;
			device.description = d.description;
			device.type = d.type;
			device.commands = {};

			for (c in d.commands){
				new function(){
					var command = d.commands[c];
					var message = {
						id: id,
						command: command
					}
					device.commands[command] = function(callback){
						//console.log(message);
						motor.io.emit('message', message, callback);
					};
				}
			}
			motor.devices[id] = device;
		};
		core.emit('motor-ready');
	});
}

var Sensory = function(settings){
	var sensory = this;
	var core = settings.core;

	this.io = settings.io;
	this.io.on('connect', function(){
		console.log('connected to sensory!');
	});

	this.devices = {};

	var Device = { //holds device classes
		Remote: function(){
			var remote = this;
			this.onPress = function(cb){
				return function(state){
					if (state){
						cb();
					};
				}
			};
			this.buttonhandle = {};
			this.handle = function(message){
				if (typeof(remote.buttonhandle[message.button]) == "function"){
					remote.buttonhandle[message.button](message.state);
				};
			}
		}
	};

	this.io.on('info', function(data){
		for (id in data.devices){
			var d = data.devices[id];
			var device = {};

			device.name = d.name;
			device.description = d.description;
			device.type = d.type;
			if (device.type in Device) {
				Device[device.type].call(device);
			}
			sensory.devices[id] = device;
		}

		core.emit('sensory-ready');
	});

	this.io.on('message', function(data){
		//console.log(data);
		sensory.devices[data.device].handle(data.message);
	});
}

var Core = function(urlbase){
	urlbase = typeof urlbase !== 'undefined' ? urlbase: '';
	console.log(urlbase);
	var core = this;

	this.motor = new Motor({
		io: io.connect(urlbase + '/motor'),
		core: core,
	});

	this.sensory = new Sensory({
		io: io.connect(urlbase + '/sensory'),
		core: core,
	});

	var ready = {
		motor: false,
		sensory: false
	}
	this.on('motor-ready', function(){
		console.log('motor devices initialized');
		ready.motor = true;
		if (ready.sensory){
			core.emit('ready');
		}
	});

	this.on('sensory-ready', function(){
		console.log('sensory devices initialized');
		ready.sensory = true;
		if (ready.motor){
			core.emit('ready');
		}
	});
};
Core.prototype = new EventEmitter();

module.exports = Core;
