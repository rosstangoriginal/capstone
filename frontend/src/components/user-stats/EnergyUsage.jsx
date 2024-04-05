import {Chart} from 'chart.js/auto';
import {CategoryScale} from 'chart.js';
import { UserData } from '../utils/UserData';
import LineChart from '../charts/LineChart';

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

Chart.register(CategoryScale);

const EnergyUsage = () => {
    const navigate = useNavigate();
    const [transactionStatus, setTransactionStatus] = useState(null);

    // const handleSubmit = async () => {
    //     try {
    //         const response = await fetch(
    //             "http://localhost:3000/perform_transaction",
    //             {
    //                 method: 'POST',
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify({}),
    //             }
    //         );

    //         const result = await response.json();

    //         if (result.success) {
    //             setTransactionStatus("Transaction successful!");
    //             localStorage.setItem('transactionStatus', transactionStatus);
    //             localStorage.setItem('etherPaid', amount);
    //             navigate('/Billing');
    //         } else {
    //             setTransactionStatus(`Error: ${result.error}`);
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         setTransactionStatus(
    //             "An error occurred while performing the transaction."
    //         );
    //     }
    // };
    
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
            <div class="header">
                <h1>Energy usage for {localStorage.getItem('energyProvider')}</h1>                
            </div>           
            <div style={{width: 1000, height: 500, display: 'flex', justifyContent: "center", margin:"auto" }}>
                <LineChart name="usage-chart" chartData={chartData}/>
            </div>
        </div>
    );
};

export default EnergyUsage;