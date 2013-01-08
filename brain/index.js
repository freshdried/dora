var server = require("./server");
var bh = require("./buttonhandlers");


var REMOTE_PHILIPS_RC_5331 = {
	'LEFT' : 0x45A,
	'RIGHT' : 0x45B,
	'PLAY' : 0x45C,
};
var r = REMOTE_PHILIPS_RC_5331;

var handle = {}
handle[r.LEFT] = bh.toggleA;
handle[r.RIGHT] = bh.toggleB;
handle[r.PLAY] = bh.toggleC;

server.start(handle);
