var ss = require("./serialserver");
var cronjob = require("cron").CronJob;
var relays = require("./relays");
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var request = require('request');


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
			var date = new Date()
			var str = (parseInt(date.getHours()) % 12).toString() + ' ' + date.getMinutes().toString();
			str = str.split('')[3] == '0' ? str.substring(0,3) + 'o' + str.substring(4) : str;
			exec("echo it is " + str + "|espeak --stdout -s 120| aplay", 
			     function(error, stdout, stderr){
			});
		};
		this[remote.SWEST] = function(){
			request('http://data.mtgox.com/api/1/BTCUSD/ticker', function(error, response, body){
				if(!error && response.statusCode == 200){
					var last = JSON.parse(body)['return']['last']['display_short'].toString().substring(1);
					str = last + ' dollars';
					exec('echo ' + str + "|espeak --stdout -s 120| aplay", 
					     function(error, stdout, stderr){
					});
				}
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
