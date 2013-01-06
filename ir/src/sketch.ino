#include "IRremote.h"

/*
 * IR2SS2R - IR2Serial+Serial2Realy
 *
 * 01/63/12
 * Sean Lee
 *
 * Gets IR signal from DVD player remote (Phillips RC-5331)
 * Cleans it up a bit
 * Sends it to serial, with human-readable hex values
 *
 */ 


#define IRRECV_PIN 2
#define RELAY_A_PIN 13
#define RELAY_B_PIN 12
#define RELAY_C_PIN 11

IRrecv irrecv(IRRECV_PIN);
decode_results results;

void setup()
{
	Serial.begin(9600);
	irrecv.enableIRIn();

	pinMode(RELAY_A_PIN, OUTPUT);
	pinMode(RELAY_B_PIN, OUTPUT);
	pinMode(RELAY_C_PIN, OUTPUT);

}

void loop()
{
	//Serial to Remote
	while(Serial.available() > 0)
	{
		int cmd = Serial.read();
		switch(cmd)
		{
			case 'A': digitalWrite(RELAY_A_PIN, HIGH); break;
			case 'B': digitalWrite(RELAY_B_PIN, HIGH); break;
			case 'C': digitalWrite(RELAY_C_PIN, HIGH); break;
			case 'a': digitalWrite(RELAY_A_PIN, LOW); break;
			case 'b': digitalWrite(RELAY_B_PIN, LOW); break;
			case 'c': digitalWrite(RELAY_C_PIN, LOW); break;
		}
	}




	//Remote to Serial 
	if(irrecv.decode(&results))
	{
		long out = results.value;
		if(out > 0 && out < 131072)
		{
			Serial.println(out, HEX);
		}
		irrecv.resume();
	}
}
