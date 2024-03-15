from brownie import accounts, exceptions, network
import pytest
from web3 import Web3

# Import the deployment script
from scripts.deploy import deploy_energybilling
from scripts.helpful_scripts import get_account

# Helper function to convert ether to wei
def to_wei(ether):
    return Web3.toWei(ether, "ether")

@pytest.fixture
def energy_billing():
    # Deploy the contract and add an initial provider
    energy_billing = deploy_energybilling()
    return energy_billing

def test_report_consumption_and_pay_bill(energy_billing):
    if network.show_active() != 'sepolia':
        pytest.skip("This test is intended for the Sepolia testnet")

    consumer = accounts.load('kaptest')  # Assuming this is the consumer account
    provider_address = "0xf9a0f668515Cf55393E728Cfd5c2a4b10b49d09E"

    # Select the provider - Ensure this matches the logic of your smart contract

    energy_billing.selectProvider(provider_address, {"from": consumer})
    # Set example consumption values
    peak_consumption = 10
    mid_peak_consumption = 15
    off_peak_consumption = 20

    # Report consumption
    energy_billing.reportConsumption(peak_consumption, mid_peak_consumption, off_peak_consumption, {"from": consumer})
    
    # Calculate the expected bill in wei
    # Assuming all rates are 0.001 ether per unit as per your setup
    expected_bill_wei = to_wei(0.001) * (peak_consumption + mid_peak_consumption + off_peak_consumption)
    
    # Fetch the calculated bill from the contract
    calculated_bill_wei = energy_billing.calculateBill(consumer.address, {"from": consumer})
    
    # Assert the calculated bill matches the expected bill
    assert expected_bill_wei == calculated_bill_wei, "The bill calculated by the contract does not match the expected value"

    # Pay the bill
    # Ensure the consumer account has enough balance (testnet ether) for the transaction
    tx = energy_billing.payBill({"from": consumer, "value": calculated_bill_wei})
    
    # Validate the payment
    # In a real scenario, you might check balances before and after, but here we check the transaction succeeded
    assert tx is not None, "Transaction failed"
    assert 'BillPaid' in tx.events, "Bill payment event not triggered"
