import hvac
import json

def create_secret():

    client = hvac.Client(url='http://localhost:8200')
    print(f" Is client authenticated: {client.is_authenticated()}")
    read_response = client.secrets.kv.v2.create_or_update_secret(path='hello',secret=dict(foo="bar"))
    
    print(json.dumps(read_response,indent=4,sort_keys=True))


def read_secret():
    client = hvac.Client(url='http://localhost:8200')
    read_response = client.secrets.kv.v2.read_secret_version(path='hello')
    print(json.dumps(read_response,indent=4,sort_keys=True))



# create_secret()
read_secret()