var io = {};
var sp = {};

var Device = new function(){
	var Device = function(info){
		this.code = info.code;
		this.name = info.name || "";
		this.description = info.description || "";
	};
	var PopulateCommands = function(){
		this.commands = (function(Device){
			var commands = [];
			for(attr in Device){
				if (typeof(Device[attr]) == "function"){
					commands.push(attr);
				};
			}
			return commands;
		})(this);
	}


	this.Relay = function(info){
		Device.call(this, info);
		this.type =  'Relay';

		var messages = [this.code.toLowerCase(), this.code.toUpperCase()];
		var state = info.initialstate || 1;
		var write = function(newstate){
			sp.write(messages[newstate]);
			state = newstate;
		};


		this.getstate =  function(socket){ socket.emit(state)}; //fix
		this.toggle =  function(){ write(state^1) };
		this.on = function(){ write(1) };
		this.off = function(){ write(0) };

		PopulateCommands.call(this);
	};
}

var Motor = function(settings){
	console.log('Motor initialized');

	io = settings.io;
	sp = settings.sp;

	var devices = {};

	for (id in settings.devices){
		var params = settings.devices[id];
		devices[id] = new Device[params.type](params);
	}


	sp.on("open", function(){
		console.log("Motor: serialport open");
		io.on('connection', function(socket){
			socket.emit('info', {
				devices: devices
			});
			var messagehandle = function(msg){
				//console.log(msg);
				try{
					devices [msg.id] [msg.command] (socket);
				}catch(e){
					console.log(e);
				}


			};
			socket.on('message', messagehandle);
		});

		sp.on('data', function(data){
			console.log("SERIAL: " + data);
		});
	});


	sp.on("close", function(){
		console.log('close');
		//implement error!
	});

}
module.exports = Motor;
