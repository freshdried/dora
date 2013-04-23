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
		
	        // Say current time
		this[remote.SOUTH] = function(){
			var date = new Date()
			var hours = (parseInt(date.getHours()) % 12).toString()
			hours = hours != "0" ? hours : "12";

			var minutes = date.getMinutes().toString();
			if (minutes == '0'){
				minutes = 'o clock';
			}else if (minutes.length == 1){
				minutes = "o" + minutes;
			}
			exec("echo it is " + hours + ' ' + minutes + "|espeak --stdout| aplay", 
			     function(error, stdout, stderr){
			});
		};
		// Say last bitcoin price in USD on MtGox
		this[remote.SWEST] = function(){
			request('http://data.mtgox.com/api/1/BTCUSD/ticker', function(error, response, body){
				if(!error && response.statusCode == 200){
					var last = JSON.parse(body)['return']['last_local']['display_short'].toString().substring(1);
					str = last + ' dollars';
					exec('echo ' + str + "|espeak --stdout -s 180| aplay", 
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
