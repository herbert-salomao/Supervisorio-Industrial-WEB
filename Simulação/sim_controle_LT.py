import time
import random
import requests

url = 'https://automated-api.vercel.app'



SP = int(input('Digite o SetPoint: '))



# Publish messages every second
try:
    while True:
        payload = {
            'message' : f'{int(random.uniform(SP-3, SP+3))}'
            }
        
        response = requests.put(f'{url}/api/mv_lt02', json=payload)

        message = "{:0.2f}".format(random.uniform(SP-3, SP+3))
        print(f"Published '{message}' status code:  '{response.status_code}'")
        time.sleep(1)

except KeyboardInterrupt:
    print("Exiting...")
