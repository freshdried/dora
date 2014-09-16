#room
a design exercise in distributed domotics.

<br>
<br>
<br>
<br>


###todo:
- implement remote control
- fix dimming api so 0 is off and 127 is on
- use bootstrap in remote
- create a device registrar (upward publish)
	- distributed?
		- https://en.wikipedia.org/wiki/Service-oriented_architecture
	- design protocol?

- make front-facing website
	- ec2?
		- how to connect with local server instance?
			- nat traversal? make local server a special class of client? ZMQ!
				- (local dealer socket) publish to (ec2 router socket)
- security!
