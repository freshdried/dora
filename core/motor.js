module.exports = function(config){
	var io = config.io;
	var sp = config.sp;

	sp.on("open", function(){
		console.log("open");
		var Device = function(letter, info){
			info = info || {};
			this.name = this.name || info.name || "";
			this.description = this.description || info.description || "";
			this.commands = (function(scope){
				var commands = [];
				for(attr in scope){
					if (typeof(scope[attr]) == "function"){
						commands.push(attr);
					};
				}
				return commands;
			})(this);
		};
		var Relay = function(letter, initialState, info){
			var messages = [letter.toLowerCase(), letter.toUpperCase()];
			var state = initialState;
			var write = function(newstate){
				sp.write(messages[newstate]);
				state = newstate;
			};
			write(state); //initial state

			this.type =  'Relay';

			this.getstate =  function(){ return state };
			this.toggle =  function(){ write(state^1) };
			this.on = function(){ write(1) };
			this.off = function(){ write(0) };

			Device.call(this, letter, info);
		};
		var devices = {
			'a': new Relay('a', 1),
			'b': new Relay('b', 1),
			'c': new Relay('c', 1),
		}
		io.on('connection', function(socket){
			socket.emit('info', devices);
			var messagehandle = function(msg){
				console.log(msg);
				try{
					devices [msg.id] [msg.command] ();
				}catch(e){
					console.log(e);
				}


			};
			socket.on('message', messagehandle);
		});

		sp.on('data', function(data){
			console.log("SERIAL: " + data);
		});
	});


	sp.on("close", function(){
		console.log('close');
		//implement error!
	});
}
