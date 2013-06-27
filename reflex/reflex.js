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
			ready.motor = true;
			if (ready.sensory){
				core.emit('ready');
			}
		});

		this.on('sensory-ready', function(){
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
					for (id in data){
						var d = data[id];
						var device = {};
						device.name = d.name;
						device.description = d.description;
						device.type = d.type;
						device.commands = {};

						for (c in d.commands){
							var command = d.commands[c];
							device.commands[command] = function(){
								self.io.emit('message', {
									id: id,
									command: command
								});
							};
						}
						self.devices[id] = device;
					};
					console.log('motor devices initialized');
					console.log(self);
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

			(function(self){
				self.io.on('info', function(data){
					for (id in data){
						var d = data[id];
						var device = {};

						device.name = d.name;
						device.description = d.description;
						device.type = d.type;
						device.commands = {};
						//TODO:finish this, add type-based initialization here

					}

					console.log('sensory devices initialized');
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
	core.sensory.devices['remote'] = new function(){
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
