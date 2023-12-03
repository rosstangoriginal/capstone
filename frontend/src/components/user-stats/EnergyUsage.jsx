// import {useState} from 'react';
// import {UserData} from "../../UserData";
// // import {Line} from "react-chartjs-2";
// import LineChart from "../charts/LineChart";
// import {Chart as ChartJS} from 'chart.js/auto';



export default (props) => {
    // const [userData, setUserData] = useState({
    //     labels: UserData.map((data) => data.month),
    //     datasets: [{
    //         label: "Energy Used (kWh)",
    //         data: UserData.map((data) => data.usage)
    //     }]
    // });

    return (
    <div>
      <h1>Energy usage</h1>
      <p>
        {props.firstName}, your energy usage for {props.date} was{" "}
        {props.energyUsed} kWh
      </p>
      {/* <LineChart chartData={userData}/> */}
    </div>
  );
};
