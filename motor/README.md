##motor.ino

Connects computer to physical world

###limbs
1. Mains Relays (3)
	- __INPUT__: 'A', 'B', or 'C' via Serial
	- __OUTPUT__: respective relay turns _ON_
	- __INPUT__: 'a', 'b', or 'c' via Serial
	- __OUTPUT__: respective relay turns _OFF_
	
	

###Dependencies
- ino (http://inotool.org/)

###Instructions:
>_in this directory..._

>ino build

>ino upload

###TODO
 - Add pictures
 - Include wiring diagrams, give credit to glacialwanderer
##motor.js

###Dependencies
- node-serialport (https://github.com/voodootikigod/node-serialport)

###install and run
> _in this directory_

> npm install serialport

> node index.js

###TODO
 - On reset, make lights last configuration
