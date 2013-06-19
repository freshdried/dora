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

