from flask import Flask, jsonify, request
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import hashes
import hvac
import os
import base64

app = Flask(__name__)

# Generate and serialize public/private keys
def generate_keys():
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048,
        backend=default_backend()
    )
    public_key = private_key.public_key()
    return private_key, public_key

def serialize_keys(private_key, public_key):
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
    
    return private_key_serialized, public_key_serialized

# Method to generate a nonce
def generate_nonce():
    return os.urandom(16).hex()

def publickeytovault(public_key_serialized, nonce):
    client = hvac.Client(url='http://localhost:8200')
    print(f"Is client authenticated: {client.is_authenticated()}")
    # Decode the PEM encoded public key from bytes to a string
    finalpublickey_str = public_key_serialized.decode('utf-8')
    read_response = client.secrets.kv.v2.create_or_update_secret(
        path='publickey',
        secret=dict(key=finalpublickey_str, nonce=nonce)
    )
    print(read_response)

def decrypt_message_with_private_key(encrypted_message, nonce, expected_nonce_hex, private_key_serialized):
    # Deserialize the private key
    private_key = serialization.load_pem_private_key(
        private_key_serialized,
        password=None,
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

