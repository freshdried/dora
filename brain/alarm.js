var EventEmitter = require('events').eventemitter;
var util = require('util');

//TODO: figure out how Date module works...
// Also currently my alarm is really a timer.
// Make it a
var Alarm = function(time, callback){
	var self = this;
	timediff = 0;// FIX
	setTimeout(function(){
		self.emit('ring', callback);
	}, timediff);

	this.on('snooze', function(){
		//extend alarm
	});
};
util.inherits(Alarm, EventEmitter);

module.exports = Alarm;
