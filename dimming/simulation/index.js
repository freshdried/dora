var azp = require('arduino-zmq-proxy');
var VirtualArduino = require('virtual-arduino');

var light = document.body;

function init() {
	light.innerHTML = "";
}

function onDataFromComputer(data) {
	console.log(data);
	var val = 2 * (127 - data[0]);
	console.log(val);
	light.style.backgroundColor = 'rgb(' + val + ','  + val + ',' + val + ')';
}

var arduino = new VirtualArduino(init, onDataFromComputer);
azp(arduino.sp, 'dimming');
