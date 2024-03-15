from flask import Blueprint, jsonify, request
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
import hvac
import json
import os
import base64
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import hashes

# Generate private key
private_key = rsa.generate_private_key(
    public_exponent=65537,
    key_size=2048,
    backend=default_backend()
)

# Generate public key
public_key = private_key.public_key()

# generate nonce
nonce = os.urandom(16)  
nonce_hex = nonce.hex()  # Encode bytes object to hexadecimal string



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


def publickeytovault(finalpublickey,nonce):
    client = hvac.Client(url='http://localhost:8200')
    print(f"Is client authenticated: {client.is_authenticated()}")
    # Decode the PEM encoded public key from bytes to a string
    finalpublickey_str = finalpublickey.decode('utf-8')
    read_response = client.secrets.kv.v2.create_or_update_secret(
        path='publickey',
        secret=dict(key=finalpublickey_str,nonce=nonce)
    )
    print(json.dumps(read_response, indent=4, sort_keys=True))

publickeytovault(public_key_serialized,nonce_hex)


def decrypt_message_with_private_key(encrypted_message, nonce, expected_nonce_hex, private_key_serialized):


    # Deserialize the private key
    private_key = serialization.load_pem_private_key(
        private_key_serialized,
        password=None,  # Assuming the key is not encrypted
    )

    # Verify the nonce
    if nonce != expected_nonce_hex:
        return "Nonce verification failed. The message may not be authentic."

    # Decrypt the message
    try:
        decrypted_data = private_key.decrypt(
            base64.b64decode(encrypted_message),
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        )
        return decrypted_data.decode('utf-8')  # Assuming the original message was UTF-8 encoded
    except Exception as e:
        return f"Decryption failed: {str(e)}"


def create_secret(data):
    client = hvac.Client(url='http://localhost:8200')
    print(f" Is client authenticated: {client.is_authenticated()}")
    read_response = client.secrets.kv.v2.create_or_update_secret(path='data',secret=dict(key=data))
    print(json.dumps(read_response,indent=4,sort_keys=True))

blueprint = Blueprint('vault_api', __name__, url_prefix='/vault_api')

@blueprint.route('/get_key', methods=['GET'])
def get_public_key():
    client = hvac.Client(url='http://localhost:8200')
    read_response = client.secrets.kv.v2.read_secret_version(path='publickey')
    key = read_response['data']['data']['key']
    nonce = read_response['data']['data']['nonce']
    return jsonify({'key': key, 'nonce': nonce})

@blueprint.route('/send_key', methods=['POST'])
def get_data():
    try:
        data = request.get_json()
        encryptedpassword = data['encryptedPassword']
        nonce2 = data['nonce']
        decrypted = decrypt_message_with_private_key(encryptedpassword,nonce2,nonce_hex,private_key_serialized)
        print("decrypted is: " + decrypted)
        create_secret(data)  # Ensure this function exists and correctly processes the data
        return jsonify({"message": "Key added successfully."}), 200
    except Exception as e:
        print("Error: ", str(e))  # Log the error for debugging
        return jsonify({"error": str(e)}), 400




# Generate private key
private_key = rsa.generate_private_key(
    public_exponent=65537,
    key_size=2048,
    backend=default_backend()
)

# Generate public key
public_key = private_key.public_key()

# generate nonce
nonce = os.urandom(16)  
nonce_hex = nonce.hex()  # Encode bytes object to hexadecimal string



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

# Store the serialized public key in Vault
publickeytovault(public_key_serialized,nonce_hex)
print(nonce)
# get_public_key()
# get_data()


# Call the function
# decrypted_message = decrypt_message_with_private_key(encrypted_message, nonce, expected_nonce_hex, private_key_serialized)
# print(decrypted_message)
