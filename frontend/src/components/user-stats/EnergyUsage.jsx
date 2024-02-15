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
import { formatEther } from '@ethersproject/units';
Chart.register(CategoryScale);

const EnergyUsage = () => {

const [errorMessage, setErrorMessage] = useState(null);
const [defaultAccount, setDefaultAccount] = useState(null);
const [userBalance, setUserBalance] = useState(null);



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

async function sendTransaction(){
    let params = [{
        from: defaultAccount,
        to: "0xf9a0f668515Cf55393E728Cfd5c2a4b10b49d09E",
        gas: Number(21000).toString(16),
        gasPrice: Number(2500000).toString(16),
        value : Number(10000000000000000).toString(16),
    }]


let result = await window.ethereum.request({method: "eth_sendTransaction", params}).catch((err)=>{
    console.log(err)
})
}

    
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
    

    // const handleSubmit = (e) => {
        // e.preventDefault();
        // const bill = {amount};

        /* ****** modify when we get the actual endpoint  */
        // fetch('http://localhost:8000/', {
        //     method: 'POST',
        //     headers: {"Content-Type": "application/json"},
        //     body: JSON.stringify(bill)
        // })
        // .then((response) => {
        //     if(response.ok) {
        //         // Happy path
        //         /* **** modify after testing */
        //         return response.json();
                // localStorage.setItem('currentEnergyUsed', amount);
                // localStorage.setItem('currentBillPaid', response.data.amountPaid);
                // localStorage.setItem('currentBillPaid', 100);
                // navigate('/Billing');
        //     }
        //     return Promise.reject(response);
        // })
        // .then((result) => {
        //     console.log(result);
        // })
        // .catch((error) => {
        //     console.log('Something went wrong.', error);
        // })
    // }

    // const monthOptions = [
    //     {value: UserData[0].usage, label: "January"},
    //     {value: UserData[1].usage, label: "February"},
    //     {value: UserData[2].usage, label: "March"},
    // ];

    return (
        <div>
            <h1>Energy usage</h1>
            <h4>Pay energy bill of 0.05 ether</h4>
            <button onClick = {ConnectButton}>connect wallet</button>
            <h3>Adress : {defaultAccount}</h3>
            <h3>Balance : {userBalance}</h3>
            <div style={{width: 700, display: 'flex', justifyContent: "center" }}>
            <h3>Pay bill</h3>
            <form onSubmit = {sendTransaction}>
            <input type ="submit" value = "Submit"/>
            </form>
                <LineChart chartData={chartData}/>
            </div>
        </div>
    );

};
export default EnergyUsage;