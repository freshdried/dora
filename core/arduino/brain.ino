#include "IRremote.h"

/*
 * sensory
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
	//Remote
	if(irrecv.decode(&results))
	{
		long out = results.value;
		if(out > 0 && out < 131072) //filter out noise
		{
			Serial.print('R');
			Serial.println(out, HEX);
		}
		irrecv.resume();
	}
}
