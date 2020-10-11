import time
import grovepi
import sys

# Connect the Grove SPDT Relay to digital port D4
# SIG,NC,VCC,GND
relay = int(sys.argv[1])
grovepi.pinMode(relay, "OUTPUT")
status = grovepi.digitalRead(relay)
print(status)
sys.stdout.flush()
sys.exit()