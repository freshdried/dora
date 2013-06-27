var io = require('socket.io-client');
var EventEmitter = require('events').EventEmitter;
var util = require('util');


var core = new function(){
	var Core = function(){
		EventEmitter.call(this);
		var core = this;

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



		this.motor =  new function(){
			this.io = io.connect('http://localhost:9000/motor');
			this.io.on('connect', function(){
				console.log('connected to motor!');
			});
			this.devices = {};

			(function(self){
				self.io.on('info', function(data){
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
								device.commands[command] = function(){
									console.log(message);
									self.io.emit('message', message);
								};
							}
						}
						self.devices[id] = device;
					};
					core.emit('motor-ready');
				});
			})(this);
		}

		this.sensory = new function(){
			this.io = io.connect('http://localhost:9000/sensory');
			this.io.on('connect', function(){
				console.log('connected to sensory!');
			});

			this.devices = {};

			var Device = { //holds device classes
				Remote: function(){
					this.onPress = function(cb){
						return function(state){
							if (state){
								cb();
							};
						}
					}
					this.buttonhandle = {};
					(function(self){
						self.handle = function(message){
							if (typeof(self.buttonhandle[message.button]) == "function"){
								self.buttonhandle[message.button](message.state);
							};
						}
					})(this);
				}
			};

			(function(self){
				self.io.on('info', function(data){
					for (id in data.devices){
						var d = data.devices[id];
						var device = {};

						device.name = d.name;
						device.description = d.description;
						device.type = d.type;
						if (device.type in Device) {
							Device[device.type].call(device);
						}
						self.devices[id] = device;
					}

					core.emit('sensory-ready');
				});

				self.io.on('message', function(data){
					console.log(data);
					self.devices[data.device].handle(data.message);
				});
			})(this);
		}
	};
	util.inherits(Core, EventEmitter);

	return new Core();
}


core.on('ready', function(){
	var remote = core.sensory.devices.remote;

	//TODO: implement promises...
	remote.buttonhandle['OK'] = remote.onPress(function(){
		core.motor.devices.a.commands.toggle();
		core.motor.devices.b.commands.toggle();
		core.motor.devices.c.commands.toggle();
	});
	remote.buttonhandle['ONE'] = remote.onPress( core.motor.devices.a.commands.toggle);
	remote.buttonhandle['TWO'] = remote.onPress( core.motor.devices.b.commands.toggle);
	remote.buttonhandle['THREE'] = remote.onPress( core.motor.devices.c.commands.toggle);
});
