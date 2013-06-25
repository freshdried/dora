var motor =  new function(){
	this.io = require('socket.io-client').connect('http://localhost:9000/motor');
	this.io.on('connect', function(){
		console.log('connected to motor!');
	});

	(function(self){
		var devices = {};
		self.io.on('info', function(data){
			devices = data;
			console.log(devices);
			
		});
	})(this);
}

var sensory = require('socket.io-client').connect('http://localhost:9000/sensory');
sensory.on('connect', function(){
	console.log('connected to sensory!');
});
sensory.on('message', function(data){
	console.log(data);
	devicehandle[data.device](data.message);
});
devicehandle = {
	'remote': new function(){
		var buttonhandle = {
			OK: function(state){
				if (state) toggle();
			},
		}
		return function(message){
			if (typeof(buttonhandle[message.button]) == "function"){
				buttonhandle[message.button](message.state);
			};
		}
	},
}

function toggle(){
	motor.io.emit('message', {
		id: 'a',
		command: 'toggle'
	});
};
