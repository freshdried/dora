
var Core = require('core-client');
var core = new Core();

var terminal = new function(){
	var output = document.getElementById('terminal-output');
	var inputline = document.getElementById('terminal-inputline');
	this.print = function(str){
		output.insertAdjacentHTML('beforeEnd', str);
		inputline.scrollIntoView();
	};
	this.println = function(){
		var args = Array.prototype.slice.call(arguments);
		output.insertAdjacentHTML('beforeEnd', args.join(' ') + "\n");
		inputline.scrollIntoView();
	};
	this.clear = function(){
		output.innerHTML = "";
	};
	this.history = [];
	this.historypos = 0;

};
terminal.println("Welcome to dora shell!");
terminal.println("Type help for help");
terminal.println("");
var commands = {
	help: function(args){
		for( i in commands){
			terminal.println(i);
		};
	},
	clear: terminal.clear,
	toggle: function(args){
		if (args.length == 0){
			core.motor.devices.a.commands.toggle();
			core.motor.devices.b.commands.toggle();
			core.motor.devices.c.commands.toggle();
		}
		else if (args[0] == "--help"){
			var str = "<i>Usage</i>: toggle [a|b|c]";
			str += "\nno args toggles all";
			str += "\nno specify a light to toggle a light";
		}
		else {
			if (core.motor.devices[args[0]]){
				core.motor.devices[args[0]].commands.toggle();
			}
		}
	},

}
var input = document.getElementById('terminal-input');
input.onkeydown = function(e) {
	var keycode = e.keycode || e.which;
	if (keycode == '38'){
		e.preventDefault();
		if (terminal.historypos < terminal.history.length){
			terminal.historypos += 1;
		}
		var index = terminal.history.length - terminal.historypos;
		input.value = terminal.history[index];
	}
	if (keycode == '40'){
		e.preventDefault();
		if (terminal.historypos > 1){
			terminal.historypos -= 1;
		}
		var index = terminal.history.length - terminal.historypos;
		input.value = terminal.history[index];
	}
}
input.onkeypress = function(e) {
	var keycode = e.keycode || e.which;
	if (keycode == '13'){
		var args = input.value.split(" ");
		terminal.println('<span class="prompt">$ </span>' + input.value);

		if (input.value.replace(/ /g, '') == ''){
		}else{
			terminal.history.push(input.value);
			terminal.historypos = 0;
			if (args[0] in commands){
				commands[args[0]](args.slice(1));
			}else{
				try{
					function split(obj){
						for(var i in obj) {
							if (obj.hasOwnProperty(i)) {
								terminal.println('<i>' + i + ':</i>', obj[i]);
							}
						};
					}
					//terminal.println(split(window.eval(input.value)));
					split(window.eval(input.value));
				}catch (e) {
					terminal.println(e);	
				}
			};
		}
		input.value = "";
	};
};
window.console.log = terminal.println

