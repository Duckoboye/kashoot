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
  Button(int pin, int id) : pin(pin), id(id), state(HIGH) {
    pinMode(pin, INPUT);
  }

  void checkState() {
    int newState = digitalRead(pin);
    if (newState != state) {
      Serial.print(id);
      Serial.println(newState);
      state = newState;
    }
  }

private:
  int pin;
  int id;
  int state;
};

Button buttonGreen(BUTTON_GREEN, 1);
Button buttonYellow(BUTTON_YELLOW, 2);
Button buttonRed(BUTTON_RED, 3);
Button buttonBlue(BUTTON_BLUE, 4);
Button buttonStart(BUTTON_START, 7);
LiquidCrystal_I2C lcd(0x27, 16, 2); 

void setup() {
  Serial.begin(115200);
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("Kashoot starting...");
}

String receivedData = "";

void loop() {
  buttonGreen.checkState();
  buttonYellow.checkState();
  buttonRed.checkState();
  buttonBlue.checkState();
  buttonStart.checkState();

  handleSerial();
}

void handleSerial() {
  if (Serial.available() > 0) {
    int incomingByte = Serial.read();
    if (incomingByte == '\n') {
      lcd.clear();
      splitAndDisplay(receivedData, lcd);
      Serial.println(receivedData);
      receivedData = "";
    } else {
      receivedData += char(incomingByte);
    }
  }
}

void splitAndDisplay(String inputString, LiquidCrystal_I2C lcd) {
  if (inputString.length() <= 16) {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print(inputString);
  } else {
    String part1 = inputString.substring(0, 16);
    String part2 = inputString.substring(16);

    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print(part1);
    lcd.setCursor(0, 1);
    lcd.print(part2);
  }
}
