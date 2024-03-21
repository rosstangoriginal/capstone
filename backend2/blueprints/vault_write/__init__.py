from flask import Blueprint, jsonify, request
import hvac
import json

blueprint = Blueprint('vault_api', __name__, url_prefix='/vault_api')


@blueprint.route('/get_key', methods=['GET'])
def get_public_key():
    client = hvac.Client(url='http://localhost:8200')
    read_response = client.secrets.kv.v2.read_secret_version(path='publickey')
    key = read_response['data']['data']['key']
    nonce = read_response['data']['data']['nonce']
    return jsonify({'key': key, 'nonce': nonce})

