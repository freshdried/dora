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


