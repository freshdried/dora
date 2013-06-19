/*
 * 
 */

var serialport = require("serialport");
var sp;

var start = function(handle){
	var SerialPort = serialport.SerialPort;
	sp = new SerialPort("/dev/ttyACM0",{
		parser: serialport.parsers.readline("\n"),
		baudrate: 9600
	});

	sp.on("open", function(){
		sp.on('data', function(data){
			var raw = parseInt(data, 16);
			rawhandle(raw, handle);
		});
	});


	sp.on("close", function(){
		console.log('close');
	});
};

var lastraw; //buffer to holder the last signaled button code
var rawhandle = function(raw, handle){
	//we clean the code so every button has one value
	var code = raw % 0x10000 
	if(typeof handle.press[code] === 'function'){
		if(raw != lastraw){
			handle.press[code](function(str){
				sp.write(str);
			});
		};
	}else if(typeof handle.hold[code] === 'function'){
		handle.hold[code](function(str){
			sp.write(str);
		});
	};
	lastraw = raw;
};


exports.start = start;

