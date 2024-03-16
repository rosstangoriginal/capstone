from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
import hvac
import json


def read_secret():
    client = hvac.Client(url='http://localhost:8200')
    read_response = client.secrets.kv.v2.read_secret_version(path='publickey')
    print(json.dumps(read_response,indent=4,sort_keys=True))

def create_secret():
    client = hvac.Client(url='http://localhost:8200')
    print(f" Is client authenticated: {client.is_authenticated()}")
    read_response = client.secrets.kv.v2.create_or_update_secret(path='publickey',secret=dict(key=final_public_key))
    print(json.dumps(read_response,indent=4,sort_keys=True))

def readmsg_secret():
    client = hvac.Client(url='http://localhost:8200')
    # Explicitly set raise_on_deleted_version to True to preserve the current behavior without warnings
    read_response = client.secrets.kv.v2.read_secret_version(path='msg', raise_on_deleted_version=True)

    # Navigate through the nested dictionaries to get to 'encryptedData'
    encrypted_data = read_response['data']['data']['foo']['encryptedData']

    # Print 'encryptedData' in a formatted JSON string
    print(json.dumps(encrypted_data, indent=4, sort_keys=True))




# Generate private key
private_key = rsa.generate_private_key(
    public_exponent=65537,
    key_size=2048,
    backend=default_backend()
)

# Generate public key
public_key = private_key.public_key()

# Serialize private key
private_key_serialized = private_key.private_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PrivateFormat.PKCS8,
    encryption_algorithm=serialization.NoEncryption()
)

# Serialize public key
public_key_serialized = public_key.public_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PublicFormat.SubjectPublicKeyInfo
)

final_public_key = public_key_serialized.decode()

# Output keys
# print("Private Key:", private_key_serialized.decode())
# print("public key: ",final_public_key)





print("----read on -----")

create_secret()
# read_secret()
# readmsg_secret()




