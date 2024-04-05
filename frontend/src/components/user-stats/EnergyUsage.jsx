// import {Chart} from 'chart.js/auto';
import {CategoryScale} from 'chart.js';
import { UserData } from '../utils/UserData';
import LineChart from '../charts/LineChart';
import {Chart} from "react-google-charts"

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

// Chart.register(CategoryScale);

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
    
    // const [chartData, setChartData] = useState({
    //     labels: UserData.map((data) => data.metric),
    //     datasets: [
    //         {
    //             label: "Energy Used (kWh)",
    //             data: UserData.map((data) => data.usage)
    //         }
    //     ]
    // })

    const [amount, setAmount] = useState(""); 
    
    const data = [
        ["Metric", "Usage"],
        ["On Peak", Number(localStorage.getItem("totalOnPeak"))],
        ["Off Peak", Number(localStorage.getItem("totalOffPeak"))],
        ["Mid Peak", Number(localStorage.getItem("totalMidPeak"))],
      ];

    const options = {
        title: "Electricity Usage by On Peak, Off Peak, & Mid Peak",
        chartArea: { width: "50%" },
        colors: ["#3b8c82"],
        hAxis: {
          title: "Electricity Usage (kWh)",
          minValue: 0,
        },
        vAxis: {
          title: "Metric",
        },
    };

    return (
        <div>
            <div class="header">
                <h1>Energy usage for {localStorage.getItem('energyProvider')}</h1>                
            </div>           
            <Chart
                chartType="BarChart"
                width="100%"
                height="400px"
                data={data}
                options={options}
            />
        </div>
    );
};

export default EnergyUsage;