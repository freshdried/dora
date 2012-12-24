#include <IRremote.h>

/*
 * IR2Serial
 *
 * 12/23/12
 * Sean Lee
 *
 * Gets IR signal from DVD player remote (Phillips RC-5331)
 * Cleans it up a bit
 * Sends it to serial, with human-readable hex values
 *
 */ 


#define IRRECV_PIN 7

IRrecv irrecv(IRRECV_PIN);
decode_results results;

void setup(){
	Serial.begin(9600);
	irrecv.enableIRIn();
}

void loop(){
	if(irrecv.decode(&results)){
		long out = results.value;
		if(out > 0 && out < 131072){
			//Serial.write(out);
			Serial.println(out, HEX);
		}
		irrecv.resume();
	}
}
