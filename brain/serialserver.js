/*
 * 
 */

var serialport = require("serialport");
var lastraw; //buffer to holder the last signaled button code

var sp;

var start = function(handle){
	var SerialPort = serialport.SerialPort;
	sp = new SerialPort("/dev/ttyUSB0",{
		parser: serialport.parsers.readline("\n"),
		baudrate: 9600
	});

	sp.on("open", function(){
		sp.on('data', function(data){
			var raw = parseInt(data, 16);
			rawhandle(raw, handle, serialport);
		});
	});


	sp.on("close", function(){
		console.log('close');
	});
};

var rawhandle = function(raw, handle){
	//console.log(raw)
	var code = raw % 0x10000 //cleaned so every button code is one value
	if(typeof handle[code] === 'function'){
		if(raw != lastraw){
			handle[code](function(str){
				sp.write(str);
			});
		};
	};
	lastraw = raw;
};


exports.start = start;

