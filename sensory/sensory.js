var serialport = require("serialport");
var io = require("socket.io").listen(9002);
io.set('resource', '/sensory/socket.io');

var sp = new serialport.SerialPort("/dev/ttyACM0",{
	parser: serialport.parsers.readline("\n"),
	baudrate: 9600
});

/*
 * PHILIPS_RC-5331 IR remote functionality:
 *
 * Each time a button is released, the (16^5)ths-place digit of the next ir message is flipped.
 * Aside from that digit, the remote fires a distinct message for each button. 
 * When a button is initially pressed, the distinct message (plus the flipping digit) is fired.
 * If the button is held down, the remote continues to fire the initial message until the button is released.
 *
 */

sp.on("open", function(){
	console.log("open");
	var getdevice = {};

	var Device = function(info){
		this.id = info.id;
		this.name = info.name || "";
		this.type = info.type;
		this.description = info.description || "";
		this.location = info.location || "";

		getdevice[info.code] = this;
		publish = function(message){
			io.sockets.emit("message", {
				device: info.id,
				message: message
			});
		};

		this.parse = console.log;
	}

	var devices = {
		'remote': new function(){
			Device.call(this, {
				id: 'remote',
				name: 'My Remote',
				type: 'Remote',
				code: 'R',
				description: 'This is Sean\'s Remote Control',
				location: 'everywhere...'

			});
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
							name: self.name,
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


		}
	}

	io.sockets.on('connection', function(socket){
		socket.emit('info', {
			devices: devices
		});
		
	});
	sp.on('data', function(data){
		var code = data[0];
		if( code in getdevice){
			getdevice[code].parse(data.substring(1));
		}
	});
});


sp.on("close", function(){
	console.log('close');
	//implement error
});
