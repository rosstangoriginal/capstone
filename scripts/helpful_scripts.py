from brownie import network, accounts, config, Contract, web3
import time

# Define Sepolia explicitly if not already defined in your environment
SEPOLIA_NETWORK = "sepolia"

# Adjusted to use explicitly for Sepolia network
def is_verifiable_contract() -> bool:
    return config["networks"][network.show_active()].get("verify", False)

def get_account(index=None, id=None):
    if network.show_active() == SEPOLIA_NETWORK:
        if index:
            return accounts[index]
        if id:
            return accounts.load(id)
        return accounts.add(config["wallets"]["from_key"])
    else:
        raise Exception("This script is only configured for the Sepolia network.")

def get_contract(contract_name):
    # Simplified to focus on Sepolia; ensure your config contains the necessary addresses
    contract_address = config["networks"][SEPOLIA_NETWORK][contract_name]
    contract = Contract.from_abi(
        contract_name, contract_address, config["deployments"][contract_name]["abi"])
    return contract

def deploy_mocks():
    # Conditional logic based on whether mocks are needed/already deployed
    print("Deploying mocks is typically a one-time setup step on testnets.")
    # Implement mock deployment logic here if necessary for your tests

def fund_with_link(contract_address, account=None, link_token=None, amount=web3.toWei(1, "ether")):
    if network.show_active() != SEPOLIA_NETWORK:
        raise Exception("This function is intended for use with the Sepolia network.")
    
    account = account if account else get_account()
    link_token = link_token if link_token else get_contract("LinkToken")
    tx = link_token.transfer(contract_address, amount, {"from": account})
    print(f"Funded {contract_address} with {amount} LINK.")
    return tx

# Adjust or remove event listening based on your contract's needs
def listen_for_event(brownie_contract, event, timeout=200, poll_interval=2):
    print("Listening for events is network agnostic; ensure your contract is deployed on Sepolia.")
    # Event listening logic here

# Example usage
if __name__ == "__main__":
    if network.show_active() == SEPOLIA_NETWORK:
        account = get_account()
        print(f"Using account {account}")
        # More logic here
    else:
        print(f"Please switch to the Sepolia network. Current network: {network.show_active()}")
