#living-space
Transforms a living space into "living" space (living as in "alive").

Ubiquitous Computing in a room.


##Goals
- The first goal of this project is __Prosthetization__
	- An attempt to harness a living space as a prosthetic, or a tool: _an extension of the user_
	- In other words, an attempt to make my life easier
	- Sensory, physical data is collected, (visualized,) and made available _to the user_

- The second goal of this project is __Intelligence__
	- An attempt to enable a room to act _for the user_
	- In other words, an attempt to make my life _even_ easier
	- Sensory, physical data is collected, processed, and acted upon _for the user_


##Remake
 - Split brain to two applications, with two arduinos
 	- sensory.js (physical to computer)
		- Arduino to websocket
	- motor.js (computer to physical)
		- Webservice to arduino
 - Then have many applications that listen/talk to sensory.js and motor.js
 	- remotelights.js
 		- Stimuli: remote
		- Reflex: lights
	- webservice to lights
		- Stimuli: http requests
		- Reflex: lights

##Todo
- Finish documentation
##motor

Connects computer to physical world

###current controls
1. Mains Relays (3)
	- Turn AC circuits on and off
	

###dependencies
- [node-serialport](https://github.com/voodootikigod/node-serialport)
- [socket.io](http://socket.io/)

###install and run
> upload sketch.ino to arduino

> npm install

> node motor.js

###TODO
 - Improve documentation
	 - Add pictures
	 - Include wiring diagrams, give credit to glacialwanderer
 - implement error handling
 	- disconnect, etc.
 - implement logging
 	- On reset, make lights last configuration

##sensory
Connects physical world to computer

###senses
1. IR Signals
	- IR signal from a remote (Phillips RC-5331)

###dependencies
- [node-serialport](https://github.com/voodootikigod/node-serialport)
- [IRRemote](https://github.com/shirriff/Arduino-IRremote) in your Arduino libraries
- [socket.io](http://socket.io/)


###install and run
> upload sketch.ino to arduino

> npm install

> node sensory.js

###Maybe later
 - implement channels if I have more devices

###TODO
 - implement error handling
 	- disconnect, etc.
 - implement logging


