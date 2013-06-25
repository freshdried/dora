##Core

Here is the core application that interfaces with the physical world.

Presents physical data/physical functions through a websocket API

###Motor Controls
1. Mains Relays (3)
	- Turn AC circuits on and off
	

###Senses
1. IR Signals
	- IR signal from a remote (Phillips RC-5331)

###dependencies
####arduino
- [IRRemote](https://github.com/shirriff/Arduino-IRremote) in your Arduino libraries

####node.js
- [node-serialport](https://github.com/voodootikigod/node-serialport)
- [socket.io](http://socket.io/)

###To run:

> #upload arduino code

> npm install

> node index.js
