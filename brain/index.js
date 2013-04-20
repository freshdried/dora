var ss = require("./serialserver");
var cronjob = require("cron").CronJob;
var relays = require("./relays");
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;


var remote = require("./remotes/PHILIPS_RC_5331.js");

var remotehandle = { 
	press: new function(){
		this[remote.POWER] = process.exit;

		this[remote.OK] = relays.toggleAll;
		this[remote.ONE] = relays.toggleA;
		this[remote.TWO] = relays.toggleB;
		this[remote.THREE] = relays.toggleC;

		//this[remote.PLAY] = function(){
		//	spawn('mpg123', ['sounds/siren_alan.mp3']);
		//};
		//this[remote.MUTE] = function(){
		//	spawn('amixer', ['set', 'PCM', 'togglemute']);
		//};
		this[remote.SOUTH] = function(){
			exec("echo it is `date + '%I %M'`|espeak --stdout | aplay", 
			     function(error, stdout, stderr){
				     console.log(stdout);
			});
		};
	},
	hold: new function(){
		//this[remote.UP] = function(){
		//	spawn('amixer', ['set', 'PCM', '5%+', '-M']);
		//};
		//this[remote.DOWN] = function(){
		//	spawn('amixer', ['set', 'PCM', '5%-', '-M']);
		//};
	},
};

var cronjobs = function(){
	//new cronjob('00 00 06 * * 1-5', function(){
	//	spawn('mpg123', ['sounds/wake_alan.mp3']);
	//},null, true);

	//new cronjob('00 30 06 * * 1-5', function(){
	//	spawn('mpg123', ['sounds/wake_alan.mp3']);
	//},null, true);
}

ss.start(remotehandle);
new cronjobs();
