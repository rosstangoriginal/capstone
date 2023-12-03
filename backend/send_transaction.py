import json

from web3 import Web3

# In the video, we forget to `install_solc`
# from solcx import compile_standard
from solcx import compile_standard, install_solc
import os
from dotenv import load_dotenv
from web3.middleware import geth_poa_middleware

ganache_url = "https://sepolia.infura.io/v3/219361541aaf4c93ab6cdb0dce733db0"
web3 = Web3(Web3.HTTPProvider(ganache_url))

load_dotenv()

with open("./SimpleTransfer.sol", "r") as file:
    simple_transfer_file = file.read()

print("Installing...")
install_solc("0.6.0")

compiled_sol = compile_standard(
    {
        "language": "Solidity",
        "sources": {"SimpleTransfer.sol": {"content": simple_transfer_file}},
        "settings": {
            "outputSelection": {
                "*": {
                    "*": ["abi", "metadata", "evm.bytecode", "evm.bytecode.sourceMap"]
                }
            }
        },
    },
    solc_version="0.6.0",
)

with open("compiled_code.json", "w") as file:
    json.dump(compiled_sol, file)

# get bytecode
bytecode = compiled_sol["contracts"]["SimpleTransfer.sol"]["SimpleTransfer"]["evm"][
    "bytecode"
]["object"]

# get abi
abi = json.loads(
    compiled_sol["contracts"]["SimpleTransfer.sol"]["SimpleTransfer"]["metadata"]
)["output"]["abi"]

my_address = "0x20FF550afD3bf73590FA8E5f26151b294A849192"
private_key = os.getenv("PRIVATE_KEY")

#account_1 = '0x20FF550afD3bf73590FA8E5f26151b294A849192' # Fill me in
account_2 = '0xf9a0f668515Cf55393E728Cfd5c2a4b10b49d09E' # Fill me in
#private_key = '0xeb9d93bcac6554f0ce1477a5754e83e4ff6b4b64b46fa6cc0db5490224a733ee' # Fill me in

nonce = web3.eth.get_transaction_count(my_address)

tx = {
    'nonce': nonce,
    'from': my_address,
    'value': web3.to_wei(0.2, 'ether'),
    'gas': 2000000,
    'gasPrice': web3.to_wei('50', 'gwei'),
}

signed_tx = web3.eth.account.sign_transaction(tx, private_key)

tx_hash = web3.eth.send_raw_transaction(signed_tx.rawTransaction)

txn_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

contract_address = txn_receipt['contractAddress']

contract_instance = web3.eth.contract(address=contract_address, abi=abi)

transfer_txn = contract_instance.functions.transferEth(account_2, web3.to_wei(0.2, 'ether')).build_transaction({
    'from': my_address,
    'gas': 200000,
    'gasPrice': web3.to_wei('50', 'gwei'),
    'nonce': nonce + 1,  # Increment the nonce
})

signed_transfer_txn = web3.eth.account.sign_transaction(transfer_txn, private_key)

# Send the transaction
transfer_hash = web3.eth.send_raw_transaction(signed_transfer_txn.rawTransaction)

print(web3.to_hex(tx_hash))