import machine
import socket
import network
import time

from machine import Pin, I2C
from I2C_LCD import I2cLcd

from secrets import wifi_ssid, wifi_password, server_ip, server_port #specify using secrets.py file on micropython device

#setup i2c
def setup_lcd():
    i2c = I2C(scl=Pin(0), sda=Pin(2), freq=400000)
    devices = i2c.scan()
    if len(devices) == 0:
        print("No i2c device detected. Make sure the LCD wires are seated correctly.")
    else:
        for device in devices:
            global lcd
            lcd = I2cLcd(i2c, device, 2, 16)
    try:
        lcd.move_to(0, 0)
        lcd.clear()
        lcd.putstr("Starting...")
    except:
        pass


class ButtonPullUp:
    def __init__(self, pin, id):
        self.pin = Pin(pin, Pin.IN, Pin.PULL_UP)
        self.id = id+64
        self.prev_state = Pin.value(self.pin)

    def check_if_released(self):
        new_state = Pin.value(self.pin)
        if self.prev_state == 0 and new_state == 1:
            self.prev_state = new_state
            print(f'{self.pin} pressed!')
            return True
        self.prev_state = new_state
        return False

def connect_to_wifi(ssid, password):
    wifi = network.WLAN(network.STA_IF)
    wifi.active(True)
    wifi.connect(ssid, password)
    while not wifi.isconnected():
        pass
    print("Connected to Wi-Fi")
    lcd.clear()
    lcd.putstr("Connected to Wi-Fi")
    return wifi

def setup_socket(server_ip, server_port):
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client.connect((server_ip, server_port))
    client.setblocking(False)
    return client

def handle_socket(client):
    try:
        data = client.recv(1024)
        return data  # Return received data or None if no data
    except OSError as e:
        # Handle non-blocking situation (no data received)
        return None
    
# Define button GPIO pins
buttons = [
    ButtonPullUp(12,0),  # Change pin numbers as needed
    ButtonPullUp(13,1),
    ButtonPullUp(14,2),
    ButtonPullUp(15,3),
    ButtonPullUp(4,4)
]

def decode_socket_data(data):
    decoded_data = data.decode().strip("'b\\n")  # Decode bytes to string and remove leading 'b' and trailing \n
    return decoded_data

def format_num(num):
    return num.to_bytes(1,"big")
               
def setup():
    setup_lcd()
    wifi = connect_to_wifi(wifi_ssid, wifi_password)
    client_socket = setup_socket(server_ip, server_port)
    
#ControlBytes
JOINED_GAME = b'\x20'
GAMESTATE = b'\x21'
QUESTION = b'\x22'
ANSWER_RESULTS = b'\x23'
WINNER = b'\x24'
    
def loop():
    while True:
        # Check button states
        for button in buttons:
            if button.check_if_released():
                formatted_id = format_num(button.id) # magic const to match ids to binary commandbyte
                client_socket.send(formatted_id)
                
        data_received = handle_socket(client_socket)
        if data_received:
            print(data_received)
            decoded_data = decode_socket_data(data_received)
            #no switches in micropython :(
            print(decoded_data)
            lcd.clear()
            lcd.putstr(decoded_data)

#setup
setup_lcd()

wifi = connect_to_wifi(wifi_ssid, wifi_password)

client_socket = setup_socket(server_ip, server_port)
print("Connected to server")
lcd.clear()
lcd.putstr("Connected to server")

loop()