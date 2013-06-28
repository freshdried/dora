var io = {};
var sp = {};

var getDeviceFromCode = {};

var Device = new function(){
	var Device = function(info){
		this.name = info.name || "";
		this.type = info.type;
		this.description = info.description || "";

		getDeviceFromCode[info.code] = this;
		publish = function(message){
			io.emit("message", {
				device: id,
				message: message
			});
		};

		this.parse = console.log;
	}

	/*
	 * PHILIPS_RC-5331 IR remote functionality:
	 *
	 * Each time a button is released, the (16^5)ths-place digit of the next ir message is flipped.
	 * Aside from that digit, the remote fires a distinct message for each button. 
	 * When a button is initially pressed, the distinct message (plus the flipping digit) is fired.
	 * If the button is held down, the remote continues to fire the initial message until the button is released.
	 *
	 */
	this.Remote = function(info){
		Device.call(this, info);
		var buttons = new function(){
			var philips = require("./remotes/PHILIPS_RC_5331");
			var buttons= {};
			Button = function(name){
				this.name = name;
				this.state = 0;
				this.releasetimeoutid = null;

				var self = this;
				this.getmessage = function(){
					return {
						button: self.name,
						state: self.state
					};
				};
			}

			for (name in philips){
				buttons[philips[name]] = new Button(name);
			}
			return buttons;
		};


		var last_raw; 
		var raw; 

		this.parse = function(data){
			raw = parseInt(data, 16);
			var code = raw % 0x10000;

			var button = buttons[code];
			if(raw != last_raw){
				button.state = 1;
				publish(button.getmessage());
			}
			last_raw = raw;
			clearTimeout(button.releasetimeoutid);
			button.releasetimeoutid = setTimeout(function(){
				button.state = 0;
				publish( button.getmessage());
			}, 120);
		};
	};

}

var Sensory = function(settings){
	console.log('Sensory initialized');
	io = settings.io;
	sp = settings.sp;

	var devices = {};

	for (id in settings.devices){
		var params = settings.devices[id];
		devices[id] = new Device[params.type](params);
	}


	sp.on("open", function(){
		console.log("Sensory: serialport open");

		io.on('connection', function(socket){
			socket.emit('info', {
				devices: devices
			});
			
		});
		sp.on('data', function(data){
			var code = data[0];
			if( code in getDeviceFromCode){
				getDeviceFromCode[code].parse(data.substring(1));
			}
		});
	});


	sp.on("close", function(){
		console.log('close');
		//implement error
	});
}
module.exports = Sensory;
