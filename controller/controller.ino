#include <Arduino.h>
#include <Wire.h> 
#include <LiquidCrystal_I2C.h>

#define BUTTON_GREEN 12
#define BUTTON_YELLOW 13
#define BUTTON_RED 14
#define BUTTON_BLUE 15
#define BUTTON_START 18

class Button {
public:
  Button(int pin) : pin(pin), state(HIGH) {
    pinMode(pin, INPUT); // Set the pin as input without internal pull-up resistor
  }

  void checkState() {
    int newState = digitalRead(pin);
    if (newState != state) {
      Serial.print(pin-11); //Father forgive me, for I have sinned.
      Serial.println(newState);
      state = newState;
    }
  }

private:
  int pin;
  int state;
};

Button button12(BUTTON_GREEN);
Button button13(BUTTON_YELLOW);
Button button14(BUTTON_RED);
Button button15(BUTTON_BLUE);
Button buttonStart(BUTTON_START);
LiquidCrystal_I2C lcd(0x27,16,2); 

void setup() {
  Serial.begin(115200);
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0,0);
  lcd.print("Kashoot starting...");
}

void loop() {
  button12.checkState();
  button13.checkState();
  button14.checkState();
  button15.checkState();
  buttonStart.checkState();

  if (Serial.available()) {
    // wait a bit for the entire message to arrive
    delay(100);
    // clear the screen
    lcd.clear();
    // read all the available characters
    while (Serial.available() > 0) {
      // display each character to the LCD
      lcd.write(Serial.read());
    }
  }
}
