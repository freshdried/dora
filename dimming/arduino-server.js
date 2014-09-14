var azp = require('arduino-zmq-proxy');

if (process.env.NODE_ENV == 'development'){
	var spawn = require('child_process').spawn;
	var nw = spawn('nw', ['simulation']);
	nw.stdout.pipe(process.stdout);
	nw.stderr.pipe(process.stderr);

} else {
	var SerialPort = require('serialport').SerialPort;

	var sp = new SerialPort("/dev/serial/by-id/usb-FTDI_FT232R_USB_UART_A4006CXv-if00-port0");
	azp(sp, 'dimming');
}

