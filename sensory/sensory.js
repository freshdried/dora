var serialport = require("serialport");
var io = require("socket.io").listen(8080);

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
	var devices = {
		'R': (function(){
			var buttons = (function(){
				var philips = require("./remotes/PHILIPS_RC_5331");
				var buttons= {};
				for (name in philips){
					var button = {
						name: name,
						state: 0,
						releasetimeoutid: null,
					}
					buttons[philips[name]] = button;
				}
				return buttons;
			})();

			var remote = io.of('/remote');
			remote.on('connection', function(socket){
				socket.emit('welcome', 'Connection Successful!');
			});
			function strip(button){
				return {
					name: button.name,
					state: button.state
				};
			}

			var last_raw; 
			var raw; 
			return {
				id: 'remote',
				type: 'remote',
				namespace: remote.name,
				parse: function(data){
					raw = parseInt(data, 16);
					var code = raw % 0x10000;

					var button = buttons[code];
					if(raw != last_raw){
						button.state = 1;
						remote.emit('message', strip(button));
					}
					last_raw = raw;
					clearTimeout(button.releasetimeoutid);
					button.releasetimeoutid = setTimeout(function(){
						button.state = 0;
						remote.emit('message', strip(button));
					}, 110);
				},
				events: ['message']
			}


		})()
	}

	var devicelist = {};
	for( code in devices){
		var device = devices[code];
		devicelist[device.id] = {
			type: device.type,
			namespace: device.namespace,
			events: device.events
		}
	}

	io.sockets.on('connection', function(socket){
		socket.emit('welcome', {
			"text": "Connect to one of these devices",
			"devicelist": devicelist
		});
		
	});
	sp.on('data', function(data){
		var code = data[0];
		if( code in devices){
			devices[code].parse(data.substring(1));
		}
	});
});


sp.on("close", function(){
	console.log('close');
});
