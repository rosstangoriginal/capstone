import "./App.css";
import Navbar from "./components/navigation/Navbar";
import RoutePaths from "./components/navigation/RoutePaths";
import {useState} from 'react';
import {UserData} from "./UserData";
import LineChart from "./components/charts/LineChart";

function App() { 
    const [userData, setUserData] = useState({
        labels: UserData.map((data) => data.month),
        datasets: [{
            label: "Energy Used (kWh)",
            data: UserData.map((data) => data.usage)
        }]
    });
    
    return (
        <div className="App">
            <Navbar />
            <h1>Blockchain Energy Project</h1>
            <LineChart chartData={userData}/>
            <RoutePaths />
        </div>
    );
}

export default App;
