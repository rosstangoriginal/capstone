import {Chart} from 'chart.js/auto';
import {CategoryScale} from 'chart.js';
import { UserData } from '../utils/UserData';
import LineChart from '../charts/LineChart';

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.css";

Chart.register(CategoryScale);

const EnergyUsage = () => {
    const navigate = useNavigate();
    const [transactionStatus, setTransactionStatus] = useState(null);

    const handleSubmit = async () => {
        try {
            const response = await fetch(
                "http://localhost:3000/perform_transaction",
                {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({}),
                }
            );

            const result = await response.json();

            if (result.success) {
                // if(true) {
                setTransactionStatus("Transaction successful!");
                localStorage.setItem('transactionStatus', transactionStatus);
                localStorage.setItem('etherPaid', amount);
                navigate('/Billing');
            } else {
                setTransactionStatus(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error(error);
            setTransactionStatus(
                "An error occurred while performing the transaction."
            );
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
            
            {/* <form onSubmit={handleSubmit}>
                <label>Enter the amount of ether you wish to pay</label>
                <input
                    type="text"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <div className="mt-5 m-auto w-50">
                    <Select 
                        // options={monthOptions} 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    >
                        <option value={50}>Januray</option>
                        <option value={65}>February</option> 
                        <option value={55}>March</option>     
                    </Select>
                </div> 
                
                
                
            </form>
                */}
            <button onClick={handleSubmit}>Perform Transaction</button>
            {transactionStatus && <p>{transactionStatus}</p>}
            <div style={{width: 700, display: 'flex', justifyContent: "center" }}>
                <LineChart chartData={chartData}/>
            </div>
        </div>
    );
};

export default EnergyUsage;