#include "IRremote.h"

/*
 * sensory.ino
 *
 * Connects physical world to computer
 *
 */ 


#define IRRECV_PIN 0

IRrecv irrecv(IRRECV_PIN);
decode_results results;

void setup()
{
	Serial.begin(9600);
	irrecv.enableIRIn();
}

void loop()
{
	if(irrecv.decode(&results))
	{
		long out = results.value;
		if(out > 0 && out < 131072) //filter out noise
		{
			Serial.println(out, HEX);
		}
		irrecv.resume();
	}
}
