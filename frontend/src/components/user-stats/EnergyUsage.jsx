import {Chart} from 'chart.js/auto';
import {CategoryScale} from 'chart.js';
import { UserData } from '../utils/UserData';
import LineChart from '../charts/LineChart';
import {ethers} from "ethers";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.css";
import { Mainnet, DAppProvider, useEtherBalance, useEthers, Config, Goerli } from '@usedapp/core';
import networkMapping from "../../chain-info/deployments/map.json"
import EnergyBillingABIget from '../../chain-info/contracts/EnergyBilling.json';

Chart.register(CategoryScale);

const EnergyUsage = () => {
//Will need to change network id to something more flexible depending on network connected

const [errorMessage, setErrorMessage] = useState(null);
const [defaultAccount, setDefaultAccount] = useState(null);
const [userBalance, setUserBalance] = useState(null);
const [peakConsumption, setPeakConsumption] = useState('');
const [midPeakConsumption, setMidPeakConsumption] = useState('');
const [offPeakConsumption, setOffPeakConsumption] = useState('');

const energyContract = networkMapping[11155111]["EnergyBilling"][0]
//Will need to change to provider of costumer's network, dynamic
const providerAddress = '0xf9a0f668515Cf55393E728Cfd5c2a4b10b49d09E'
const EnergyBillingABI = EnergyBillingABIget.abi
const ConnectButton = () => {
    if(window.ethereum){
        window.ethereum.request({method: 'eth_requestAccounts'})
        .then(result => {
            accountChanged([result[0]])
        })
    }else{
        setErrorMessage('install Metamask')
    } 
    };
    // 'account' being undefined means that we are not connected.


const accountChanged = (accountName) => {
    setDefaultAccount(accountName)
    getUserBalance(accountName)
};

const getUserBalance = (accountAddress) =>{
    window.ethereum.request({method: 'eth_getBalance', params: [String(accountAddress), "latest"]})
    .then(balance =>{
        setUserBalance(ethers.utils.formatEther(balance));
    })
};

const reportConsumptionAndPayBill = async () => {
    if (!window.ethereum) return alert("Please install MetaMask.");

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const energyBillingContract = new ethers.Contract(energyContract, EnergyBillingABI, signer);

    try {
        // Automatically select provider for user if not already selected
        await selectProviderIfNeeded(energyBillingContract, signer);

        // Report consumption
        await energyBillingContract.reportConsumption(
            Number(peakConsumption),
            Number(midPeakConsumption),
            Number(offPeakConsumption)
        );

        // Calculate bill to be paid
        const billAmount = await energyBillingContract.calculateBill(await signer.getAddress());

        // Pay the bill
        await energyBillingContract.payBill({ value: billAmount });

        alert('Bill paid successfully!');
    } catch (error) {
        console.error(error);
        alert('Failed to process your request.');
    }
};

// Automatically select provider if needed
const selectProviderIfNeeded = async (contract, signer) => {
    const userAddress = await signer.getAddress();
    const userProvider = await contract.userToProvider(userAddress);
    if (userProvider === ethers.constants.AddressZero) { // This checks if the user has no provider selected
        await contract.selectProvider(providerAddress, { from: userAddress });
    }
};

    
const [chartData, setChartData] = useState({
    labels: UserData.map((data) => data.month),
    datasets: [
        {
            label: "Energy Used (kWh)",
            data: UserData.map((data) => data.usage)
        }
    ]
})

const [amount, setAmount] = useState("");
    


    return (
        <div>
            <h1>Energy usage</h1>
            <button onClick={ConnectButton}>Connect Wallet</button>
            {defaultAccount && <div>
                <h3>Address: {defaultAccount}</h3>
                <h3>Balance: {userBalance}</h3>
                <div>
                    <label>Peak Consumption:</label>
                    <input type="number" value={peakConsumption} onChange={(e) => setPeakConsumption(e.target.value)} />
                </div>
                <div>
                    <label>Mid-Peak Consumption:</label>
                    <input type="number" value={midPeakConsumption} onChange={(e) => setMidPeakConsumption(e.target.value)} />
                </div>
                <div>
                    <label>Off-Peak Consumption:</label>
                    <input type="number" value={offPeakConsumption} onChange={(e) => setOffPeakConsumption(e.target.value)} />
                </div>
                <button onClick={reportConsumptionAndPayBill}>Report Consumption & Pay Bill</button>
                <div style={{ width: 700, display: 'flex', justifyContent: "center" }}>
                    <LineChart chartData={chartData} />
                </div>
            </div>}
        </div>
    );

};
export default EnergyUsage;