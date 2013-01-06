var server = require("./server");
var buttonHandlers = require("./buttonhandlers");

//object to hold button constants
var phillips = {
	'notimplemented': 0,
	'left': 0x45A,
	'right': 0x45B,
	'play': 0x45C,
}

var handle = {}
handle[phillips.notimplemented] = buttonHandlers.notimplemented;

handle[phillips.left] = buttonHandlers.left;
handle[phillips.right] = buttonHandlers.right;
handle[phillips.play] = buttonHandlers.play;

server.start(handle);
