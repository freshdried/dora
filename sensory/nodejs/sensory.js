var serialport = require("serialport");

var sp = new serialport.SerialPort("/dev/ttyACM0",{
	parser: serialport.parsers.readline("\n"),
	baudrate: 9600
});


sp.on("open", function(){
	var lastraw; //buffer to holder the last signaled button code
	sp.on('data', function(data){
		/*
		 * PHILIPS_RC-5331 functionality:
		 *
		 * Each time a button is released, the (16^5)th place of the next ir message is flipped. Aside from that digit, the remote fires a distinct message for each button. When a button is pressed, the distinct message (plus the flipping digit) is fired; if the button is held down, every 100ms after it was first pressed, the remote fires the same message until the button is released.
		 *
		 *
		 */
		var raw = parseInt(data, 16);
		var code = raw % 0x10000;
		if(raw != lastraw){
			console.log(code);
		};
		//on hold
		lastraw = raw;
	});
});


sp.on("close", function(){
	console.log('close');
});
