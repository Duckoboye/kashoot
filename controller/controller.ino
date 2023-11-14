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
String receivedData = "";
void loop() {
  button12.checkState();
  button13.checkState();
  button14.checkState();
  button15.checkState();
  buttonStart.checkState();

  if (Serial.available() > 0) {
    // wait a bit for the entire message to arrive
    // clear the screen
    int incomingByte = Serial.read();
    if (incomingByte == 10) {
      lcd.clear();
      splitAndDisplay(receivedData, lcd);
      Serial.println(receivedData);
      receivedData = "";
    }
    else {
      receivedData += char(incomingByte);
    }
  }
}

void splitAndDisplay(String inputString, LiquidCrystal_I2C lcd) {
  // Ensure the LCD is ready
  if (inputString.length() <= 16) {
    // If the string is 16 characters or less, display it on the first line
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print(inputString);
  } else {
    // If the string is longer than 16 characters, split it into two parts
    String part1 = inputString.substring(0, 16);
    String part2 = inputString.substring(16);

    // Display the two parts on the LCD's two lines
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print(part1);
    lcd.setCursor(0, 1);
    lcd.print(part2);
  }
}
