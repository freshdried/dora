#brain
This is the where event-handling magic takes place.
Provides high-level connections to and from hardware
Hub for incoming, sensory data and outgoing

#Dependencies
- node-serialport (https://github.com/voodootikigod/node-serialport)
- node-cron (https://github.com/ncb000gt/node-cron)


#install and run
> npm install serialport cron

> node index.js



#Remake
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

#TODO
 - Document/comment with (docstrings? idk?)
 - Move bitcoin/date stuff to separate applications, and make brain spawn them
 - Get rid of cronjobs, they don't belong here!!
 - Make an http webservice for lights
 	- on()
	- off()
	- toggle()
	- getstate()
