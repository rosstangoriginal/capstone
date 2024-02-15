from brownie import accounts, SimpleTransfer

def deploy_simple_storage():
    account = accounts.load("kaptest")
    print(account)

def send_ether():
    wallet = SimpleTransfer.deploy(accounts[0], {'from': accounts[0], "gasPrice": 100000000000000000})
    return wallet


def main():
    deploy_simple_storage()
    wallet = send_ether()
    to_address = "0xf9a0f668515Cf55393E728Cfd5c2a4b10b49d09E"
    # Replace 'to_address' and 'amount' with the recipient's address and the amount you want to transfer
    wallet.transferEth(to_address, 0.1)