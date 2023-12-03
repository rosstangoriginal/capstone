// import {useState} from 'react';
// import {UserData} from "../../UserData";
// // import {Line} from "react-chartjs-2";
// import LineChart from "../charts/LineChart";
// import {Chart as ChartJS} from 'chart.js/auto';

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const EnergyUsage = () => {
    // const [userData, setUserData] = useState({
    //     labels: UserData.map((data) => data.month),
    //     datasets: [{
    //         label: "Energy Used (kWh)",
    //         data: UserData.map((data) => data.usage)
    //     }]
    // });
    const [amount, setAmount] = useState("");
    const navigate = useNavigate();
    // const history = useHistory();

    const handleSubmit = (e) => {
        e.preventDefault();
        const bill = {amount};

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
                <input
                    type="submit"
                    value="Pay Bill"
                />
            </form>
            {/* <LineChart chartData={userData}/> */}
        </div>
    );
};

export default EnergyUsage;