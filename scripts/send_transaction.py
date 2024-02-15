# script.py
from brownie import SimpleTransfer, accounts, web3

def perform_transaction():
    try:
        # Deploy the SimpleTransfer contract if not already deployed
        if not SimpleTransfer:
            # Use the deploy function to deploy the contract
            SimpleTransfer.deploy({'from': accounts[0]})

        # Access the deployed contract using the contract's address
        simple_transfer_contract = SimpleTransfer[0]

        # Hard-coded recipient address (replace with your actual recipient address)
        recipient = '0xf9a0f668515Cf55393E728Cfd5c2a4b10b49d09E'

        # Send Ether from the first account to the smart contract
        amount_to_send = web3.toWei(0.05, "ether")
        simple_transfer_contract.sendEther(recipient, {'from': accounts[0], 'value': amount_to_send})

        print('Transaction successful')

    except Exception as e:
        print(f'Error: {str(e)}')

def main():
    perform_transaction()
