var EventEmitter = require('events').eventemitter;
var util = require('util');

//TODO: figure out how Date module works...
// Also currently my alarm is really a timer.
// Make it a

var timer = function(time, callback){
	var self = this;
	setTimeout(function(){
		self.emit('ring');
	}, time);
	self.on('ring', callback);

};
util.inherits(timer, EventEmitter);

//this.on('snooze', function(){
//	//extend alarm
//});


exports.timer = timer
