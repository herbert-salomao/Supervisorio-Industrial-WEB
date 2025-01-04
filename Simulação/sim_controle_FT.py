import paho.mqtt.client as mqtt
import time
import random

# MQTT Broker details
broker = 'localhost'  # Coloque o endereço
port = 1880
topic = 'PV_FT-01'  # Replace with your topic

SP = int(input('Digite o SetPoint: '))

# Create a client instance
client = mqtt.Client()

# Connect to the broker
client.connect(broker, port)

# Publish messages every second
try:
    while True:
        message = "{:0.2f}".format(random.uniform(SP-3, SP+3))
        client.publish(topic, message)
        print(f"Published '{message}' to topic '{topic}'")
        time.sleep(1)

except KeyboardInterrupt:
    print("Exiting...")
    client.disconnect()
