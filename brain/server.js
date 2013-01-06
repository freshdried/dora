/*
 * 
 */

var serialport = require("serialport")

function start(handle){
	var SerialPort = serialport.SerialPort;
	var serialPort = new SerialPort("/dev/ttyUSB0",{
		parser: serialport.parsers.readline("\n"),
		baudrate: 9600
	});

	serialPort.on("open", function(){
		console.log('open');
		serialPort.on('data', function(data){
			//console.log('data received: ' + data); //DEBUG
			var num = parseInt(data, 16);
			var cleannum = num % 0x10000 //cleaned so every button code is one value
			if(typeof handle[cleannum] === 'function'){
				toserial = handle[cleannum](num);
				if(null != toserial){
					serialPort.write(toserial)
				}

			}else{
				//console.log("No button handler found!"); //DEBUG
				handle[0](num);
			}
		});
	});


	serialPort.on("close", function(){
		console.log('close');
	});
}

exports.start = start;

