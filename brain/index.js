var ss = require("./serialserver");
var cronjob = require("cron").CronJob;
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
			spawn('mpg123', ['wakeup.mp3']);
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

var cronjobs = function(){
	new cronjob('* * * * * *', function(){
		console.log('This message will appear every second');
	},null, true); 
}

ss.start(remotehandle);
new cronjobs();
