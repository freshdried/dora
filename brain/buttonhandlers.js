var lastcode; //buffer to hold the last signaled button code

var base = function(code, callback){
	if(code != lastcode){
		callback();
	}
	lastcode = code;
};


var notimplemented = function(code){
	base(code, function(){});	//Do nothing
}

var play = function(code){
	base(code, function(){
		console.log("play!");
	});
}

exports.notimplemented = notimplemented;
exports.play = play;
