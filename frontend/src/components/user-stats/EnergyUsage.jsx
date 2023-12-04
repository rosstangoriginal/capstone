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
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
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
                localStorage.setItem('currentEnergyUsed', amount);
                // localStorage.setItem('currentBillPaid', response.data.amountPaid);
                localStorage.setItem('currentBillPaid', 100);
                navigate('/Billing');
        //     }
        //     return Promise.reject(response);
        // })
        // .then((result) => {
        //     console.log(result);
        // })
        // .catch((error) => {
        //     console.log('Something went wrong.', error);
        // })
    }

    // const monthOptions = [
    //     {value: UserData[0].usage, label: "January"},
    //     {value: UserData[1].usage, label: "February"},
    //     {value: UserData[2].usage, label: "March"},
    // ];

    return (
        <div>
            <h1>Energy usage</h1>
            <form onSubmit={handleSubmit}>
                <label>Enter energy usage in kWh</label>
                <input
                    type="text"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                {/* <div className="mt-5 m-auto w-50">
                    <Select 
                        // options={monthOptions} 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    >
                        <option value={50}>Januray</option>
                        <option value={65}>February</option> 
                        <option value={55}>March</option>     
                    </Select>
                </div> */}
                <input
                    type="submit"
                    value="Pay Bill"
                />
            </form>
            <div style={{width: 700, display: 'flex', justifyContent: "center" }}>
                <LineChart chartData={chartData}/>
            </div>
        </div>
    );
};

export default EnergyUsage;