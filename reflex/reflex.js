var motor =  new function(){
	this.io = require('socket.io-client').connect('http://localhost:9000/motor');
	this.io.on('connect', function(){
		console.log('connected to motor!');
	});

	(function(self){
		self.io.on('info', function(data){
			for (i in data){
				var d = data[i];
				var device = {};
				device.name = d.name;
				device.description = d.description;
				device.type = d.type;
				device.id = d.id;

				for (c in d.commands){
					(function(){
						var command = d.commands[c];
						var id = d.id;
						device[d.commands[c]] = function(){
							self.io.emit('message', {
								id: id,
								command: command
							});
						};
					})();
				}
				console.log(device);

				self[d.id] = device;
			}
		});
	})(this);
}

var sensory = new function(){
	this.io = require('socket.io-client').connect('http://localhost:9000/sensory');
	this.io.on('connect', function(){
		console.log('connected to sensory!');
	});
	this.io.on('message', function(data){
		console.log(data);
		devicehandle[data.device](data.message);
	});
}
devicehandle = {
	'remote': new function(){
		var buttonhandle = new function(){
			function onPress(fn){
				return function(state){
					if (state){
						fn();
					};
				}
			}
			return {
				OK: onPress(function(){
					motor.a.toggle();
					motor.b.toggle();
					motor.c.toggle();
				}),
				ONE: onPress(function(){ motor.a.toggle(); }),
				TWO: onPress(function(){ motor.b.toggle(); }),
				THREE: onPress(function(){ motor.c.toggle(); })
			};
		}
		return function(message){
			if (typeof(buttonhandle[message.button]) == "function"){
				buttonhandle[message.button](message.state);
			};
		}
	},
}
