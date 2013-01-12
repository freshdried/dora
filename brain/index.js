var server = require("./server"),
    relays = require("./relays");


var REMOTE_PHILIPS_RC_5331 = {
	'LEFT' : 0x45A,
	'RIGHT' : 0x45B,
	'OK' : 0x45C,
	'POWER' : 0x4C7,
	'UP' : 0x458,
	'DOWN' : 0x459,
	'RETURN' : 0x483,
	'INFO' : 0x40F,
	'BACK' : 0x421,
	'PLAY' : 0x42C,
	'FORWARD' : 0x420,
	'MUTE' : 0x40D,
	'STOP' : 0x431,
	'ONE' : 0x401,
	'TWO' : 0x402,
	'THREE' : 0x403,
	'FOUR' : 0x404,
	'FIVE' : 0x405,
	'SIX' : 0x406,
	'SEVEN' : 0x407,
	'EIGHT' : 0x408,
	'NINE' : 0x409,
	'ZERO' : 0x400,
	'WEST' : 0x44B,
	'SWEST' : 0x4F7,
	'SOUTH' : 0x4E7,
	'SEAST' : 0x4E8,
	'EAST' : 0x44E,
};
var remote = REMOTE_PHILIPS_RC_5331;

var handle = {};
handle[remote.ONE] = relays.toggleA;
handle[remote.TWO] = relays.toggleB;
handle[remote.THREE] = relays.toggleC;
handle[remote.SOUTH] = function(write){
	for (var i = 0; i< 500; i++){
		(
		function(i){
			setTimeout(function(){
				relays.toggleA(write);
			}, i);
		}
		)(i)};
};

handle[remote.POWER] = process.exit;

server.start(handle);
