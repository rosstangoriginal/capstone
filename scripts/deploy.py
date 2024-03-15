from brownie import EnergyBilling, accounts
from scripts.helpful_scripts import get_account
import os
import shutil
import json
import yaml

def deploy_energybilling():
    account = accounts.load('kaptest')
    energybill = EnergyBilling.deploy({"from":account})
    add_initial_provider(energybill,account)
    return energybill

def add_initial_provider(simplified_energy_billing, account):
    # Example provider rates
    peak_rate = 10**15  # 0.001 ether in wei
    mid_peak_rate = 10**15  # Assuming the same rate for simplicity
    off_peak_rate = 10**15

    # Add a provider to the contract
    tx = simplified_energy_billing.addProvider(
        "0xf9a0f668515Cf55393E728Cfd5c2a4b10b49d09E",  # This should be the address of the provider
        peak_rate, 
        mid_peak_rate, 
        off_peak_rate, 
        {"from": account}
    )
    tx.wait(1)
    print("Initial provider added to the contract.")

def update_front_end():
    # Send the build folder
    copy_folders_to_front_end("./build", "./frontend/src/chain-info")

    # Sending the front end our config in JSON format
    with open("brownie-config.yaml", "r") as brownie_config:
        config_dict = yaml.load(brownie_config, Loader=yaml.FullLoader)
        with open("./frontend/src/brownie-config.json", "w") as brownie_config_json:
            json.dump(config_dict, brownie_config_json)
    print("Front end updated!")


def copy_folders_to_front_end(src, dest):
    if os.path.exists(dest):
        shutil.rmtree(dest)
    shutil.copytree(src, dest)

def main():
    deploy_energybilling()
    