var server = require("./server");
var buttonHandlers = require("./buttonhandlers");

//object to hold button constants
var phillips = {
	'notimplemented': 0,
	'play': 0x45C,
}

var handle = {}
handle[phillips.notimplemented] = buttonHandlers.notimplemented;
handle[phillips.play] = buttonHandlers.play;

server.start(handle);
