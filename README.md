	- In other words, an attempt to make my life _even_ easier
	- Sensory, physical data is collected, processed, and acted upon _for the user_


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

##Todo
- create sensory.js
- Finish documentation
- Minor fixes:
	- Fix '12:03' as 'zero three'
	- Fix bitcoin ticker to be more real time

