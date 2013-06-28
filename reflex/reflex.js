var Core = require('core-client');

var core = new Core;

core.on('ready', function(){
	var remote = core.sensory.devices.remote;
	console.log(core);

	remote.buttonhandle['OK'] = remote.onPress(function(){
		core.motor.devices.a.commands.toggle();
		core.motor.devices.b.commands.toggle();
		core.motor.devices.c.commands.toggle();
	});
	remote.buttonhandle['ONE'] = remote.onPress( core.motor.devices.a.commands.toggle);
	remote.buttonhandle['TWO'] = remote.onPress( core.motor.devices.b.commands.toggle);
	remote.buttonhandle['THREE'] = remote.onPress( core.motor.devices.c.commands.toggle);
});
