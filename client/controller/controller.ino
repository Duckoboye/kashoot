#include <Arduino.h>

#define BUTTON_GREEN 12
#define BUTTON_YELLOW 13
#define BUTTON_RED 14
#define BUTTON_BLUE 15

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

void setup() {
  Serial.begin(115200);
}

void loop() {
  button12.checkState();
  button13.checkState();
  button14.checkState();
  button15.checkState();
}
