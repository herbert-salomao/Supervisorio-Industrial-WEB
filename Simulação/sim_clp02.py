import time
import random

from pid import PIDController
import requests



url = 'https://automated-api.vercel.app'

headers = {
    'Content-Type': 'application/json'   # Ensure you're sending JSON data
}


dt = 1.0
database = []
#PIDController(kp=9.9, ki=0.066 , kd=0)
pid = PIDController(kp=9.9, ki=0.066 , kd=0)
tank_capacity = 100  # in liters
fixed_outflow_rate = 5  # in liters/second

tank_level = 0.0  # initial tank level in liters
inflow_rate = 0.0  # initial inflow rate in liters/second
# Create a client instance





SP = 0




while True:



    time.sleep(1)
    #estado = requests.get(f'{url}/api/planta').json()
    estado = True
    if estado:
        
        SP_IHM = requests.get(f'{url}/api/sp_clp02').json()

        SP = int(SP_IHM)
        error = round(SP - tank_level,1)



        inflow_rate  = pid.compute(tank_level, dt, SP)
        tank_level += ((inflow_rate *0.2) - fixed_outflow_rate) * dt
        tank_level = max(0, min(tank_capacity, tank_level))  # Clamp tank level to 0-100 liters


        mensagem = "{};{};{}".format(SP, int(tank_level), int(inflow_rate ))

        payload = {
        'SP': SP,
        'PV': int(tank_level),
        'MV': int(inflow_rate )
        }
        print('mensagem: ', mensagem)
        response = requests.post(f'{url}/api/clp02', json=payload, headers=headers)
        
        # Check the response
        if response.status_code == 201:
            print(f"Data added successfully: {response.json()}")
        else:
            print(f"Error: {response.status_code}, {response.json()}")


"""
try:
    while True:
        mensagem = "{};{};{}".format(SP, int(random.uniform(SP-6, SP+6)), int(random.uniform(SP-3, SP+3)))
        client.publish(topic, mensagem)
        print(f"Publicado: {mensagem} no tópico: {topic}")
        time.sleep(1)  # Espera 1 segundo antes de publicar a próxima mensagem
except KeyboardInterrupt:
    print("Interrompido pelo usuário")
finally:
    client.loop_stop()
    client.disconnect()

"""

'''

def on_message(client, userdata, message):
    print(f"Received message '{message.payload.decode()}' on topic '{message.topic}'")

    if message.topic == "SP_CLP-02/DSB":
        SP = int(message.payload.decode())
        message = "{};{};{}".format(SP, int(random.uniform(PV-3, PV+3)), int(random.uniform(MV-3, MV+3)))



        client.publish(topic, message)
        print(f"Published '{message}' to topic '{topic}'")
     
client.on_message = on_message
client.loop_forever()

'''