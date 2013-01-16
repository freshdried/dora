var ss = require("./serialserver");
var alarm = require("./alarm");
var relays = require("./relays");
var spawn = require('child_process').spawn;


var remote = require("./remotes/PHILIPS_RC_5331.js");

var remotehandle = { 
	press: new function(){
		this[remote.POWER] = process.exit;

		this[remote.OK] = relays.toggleAll;
		this[remote.ONE] = relays.toggleA;
		this[remote.TWO] = relays.toggleB;
		this[remote.THREE] = relays.toggleC;

		this[remote.PLAY] = function(){
			t = new alarm.timer(1000, function(){
				spawn('mpg123', ['wakeup.mp3'])
			});
		};
		this[remote.MUTE] = function(){
			spawn('amixer', ['set', 'PCM', 'togglemute']);
		};
	},
	hold: new function(){
		this[remote.UP] = function(){
			spawn('amixer', ['set', 'PCM', '5%+', '-M']);
		};
		this[remote.DOWN] = function(){
			spawn('amixer', ['set', 'PCM', '5%-', '-M']);
		};
	},
};

ss.start(remotehandle);
