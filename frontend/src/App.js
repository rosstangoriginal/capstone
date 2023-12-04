import "./App.css";
import Navbar from "./components/navigation/Navbar";
import RoutePaths from "./components/navigation/RoutePaths";

function App() {     
    return (
        <div className="App">
            <Navbar />
            <h1>Blockchain Energy Project</h1>
            {/* <LineChart chartData={userData}/> */}
            <RoutePaths />
        </div>
    );
}

export default App;
