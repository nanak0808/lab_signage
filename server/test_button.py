import RPi.GPIO as GPIO
import time

PIN = 23 # とりあえず23番だけテスト
GPIO.setmode(GPIO.BCM)
GPIO.setup(PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)

print("Check Button 23... Press Ctrl+C to stop")
try:
    while True:
        if GPIO.input(PIN) == GPIO.LOW:
            print("Button 23 Pressed!")
        time.sleep(0.1)
except KeyboardInterrupt:
    GPIO.cleanup()
