import time
import random
from pid import PIDController
import numpy as np
from rl_agent import QLearningAgent
import requests

#https://automated-api.vercel.app
#http://localhost:5000
url = 'https://automated-api.vercel.app'


auth_payload = {
    'username': 'mantenedor',
    'password': 'automated@senai201'
}

auth_response = requests.post(f'{url}/login', json=auth_payload)
if auth_response.status_code == 200:
    token = auth_response.json()['token']
    print("Token obtained:", token)
else:
    print('Erro na autenticação')
    quit()

# Set the headers (if necessary)
headers = {
    'Authorization': f'{token}',  # Add the token in the Authorization header
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



actions = [("increase", "Kp"), ("increase", "Ki"), ("increase", "Kd"), ("decrease", "Kp"), ("decrease", "Ki"), ("decrease", "Kd")]


Q = {}
def null_q():
    Q.clear()
def check_q():
    print('Q limpo: ', Q)
def ensure_q_entry(error):
    if error not in Q:
        Q[error] = {}
        for action in actions:
            Q[error][action] = 0

# Q-Learning parameters
alpha = 0.3  # Learning rate
gamma = 0.9  # Discount factor
epsilon = 0.3 # Exploration rate
def select_action(error):
    ensure_q_entry(error)
    if random.uniform(0, 1) < epsilon:
        return random.choice(actions)
    else:
        q_values = [Q[error][action] for action in actions]
        max_q = max(q_values)
        return actions[q_values.index(max_q)]

def update_q_table(error, action, reward, next_error):
    ensure_q_entry(error)
    ensure_q_entry(next_error)
    max_future_q = max([Q[next_error][a] for a in actions])
    current_q = Q[error][action]
    Q[error][action] = current_q + alpha * (reward + gamma * max_future_q - current_q)      


SP = 0

while True:

    time.sleep(1)
    #estado = requests.get(f'{url}/api/planta').json()
    #print(estado)
    estado = True
    if estado:
        
        SP_IHM = requests.get(f'{url}/api/sp_clp01').json()
        print('SP: ', SP_IHM)
        if SP != int(SP_IHM):
            null_q()
            check_q()
            pid.Kp = 4
            pid.Ki = 0
            pid.Kd = 0
        SP = int(SP_IHM)
        database.append(SP)
        error = round(SP - tank_level,1)


        if int(error) != 0:
            action = select_action(error)  # Scaling error for Q-table indexing
            print(action[0])
            if action[0] == "increase":
                if action[1] == "Kp":
                    pid.Kp += 0.2
                elif action[1] == "Ki":
                    pid.Ki += 0.02
                else:
                    pid.Kd += 0.02
            elif action[0] == "decrease":
                if action[1] == "Kp":
                    pid.Kp = max(pid.Kp - 0.2, 0)
                elif action[1] == "Ki":
                    pid.Ki = max(pid.Ki - 0.02, 0)
                else:
                    pid.Kd = max(pid.Kd - 0.02, 0)



        inflow_rate  = pid.compute(tank_level, dt, SP)
        tank_level += ((inflow_rate *0.2) - fixed_outflow_rate) * dt
        tank_level = max(0, min(tank_capacity, tank_level))  # Clamp tank level to 0-100 liters
        next_error = round(SP - tank_level,1)
        reward = 0
        
        if int(next_error) == 0:
            reward = 1
        elif int(abs(next_error)) >= SP:
            reward = -5
        elif int(abs(next_error)) <= SP/4:
            reward = -2
        elif int(abs(next_error)) >= SP/2:
            reward = 0
        

        if abs(error - next_error) > 0.5:
            reward = -1
        if abs(error - next_error) > 1.5:
            reward = -2
        if abs(error - next_error) > 2:
            reward = -4
        if abs(error - next_error) > 2.5:
            reward = -6
        print('taxa de erro abs: ', abs(error - next_error))


        if int(error) != 0:
            update_q_table(error, action, reward, next_error )
        print(pid.Kp, pid.Ki, pid.Kd)
        print('rewards: ', reward)
        mensagem = "{};{};{}".format(SP, int(tank_level), int(inflow_rate ))

        payload = {
        'SP': SP,
        'PV': int(tank_level),
        'MV': int(inflow_rate )
        }
        print('mensagem: ', mensagem)
        response = requests.post(f'{url}/api/clp01', json=payload, headers=headers)
        
        # Check the response
        if response.status_code == 201:
            print(f"Data added successfully: {response.json()}")
        else:
            print(f"Error: {response.status_code}, {response.json()}")

        payload = {
            'message' : f'{round(pid.Kp,2)};{round(pid.Ki,2)};{round(pid.Kd,2)}'
            }
        
        response = requests.put(f'{url}/api/pid_clp01', json=payload, headers=headers)
        if response.status_code == 200:
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