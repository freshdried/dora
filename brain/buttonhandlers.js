var lastcode; //buffer to holder the last signaled button code
//Get rid of all the returns!!!

var _base = function(code, callback){
	if(code != lastcode){
		//callback();
		return callback(); // DELETE THIS , NO RETRNS!!
	}
	lastcode = code;
};


var notimplemented = function(code){
	_base(code, function(){});	//Do nothing
}

var left = function(code){
	return _base(code, function(){
		console.log("left!");
		return "a";
	});
}
var right = function(code){
	return _base(code, function(){
		console.log("right!");
		return "c";
	});
}

var play = function(code){
	return _base(code, function(){
		console.log("play!");
		return "b";
	});
}

exports.notimplemented = notimplemented;
exports.left = left;
exports.right = right;
exports.play = play;
