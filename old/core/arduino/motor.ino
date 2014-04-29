/*
 * motor
 *
 * Computer to Physical interactions
 *
 */ 


#define RELAY_A_PIN 13
#define RELAY_B_PIN 12
#define RELAY_C_PIN 11


void setup()
{
	Serial.begin(9600);

	pinMode(RELAY_A_PIN, OUTPUT);
	pinMode(RELAY_B_PIN, OUTPUT);
	pinMode(RELAY_C_PIN, OUTPUT);

	//initial states
	digitalWrite(RELAY_A_PIN, HIGH);
	digitalWrite(RELAY_B_PIN, HIGH);
	digitalWrite(RELAY_C_PIN, HIGH);

}

void loop()
{
	while(Serial.available() > 0)
	{
		int cmd = Serial.read();
		switch(cmd)
		{
			//UPPERCASE: HIGH
			case 'A': digitalWrite(RELAY_A_PIN, HIGH); break;
			case 'B': digitalWrite(RELAY_B_PIN, HIGH); break;
			case 'C': digitalWrite(RELAY_C_PIN, HIGH); break;
			
			//lowercase: low
			case 'a': digitalWrite(RELAY_A_PIN, LOW); break;
			case 'b': digitalWrite(RELAY_B_PIN, LOW); break;
			case 'c': digitalWrite(RELAY_C_PIN, LOW); break;
		}
	}
}
