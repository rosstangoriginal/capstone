import "./App.css";
import Navbar from './components/navigation/Navbar';
import RoutePaths from "./components/navigation/RoutePaths";

function App() {
//   const [transactionStatus, setTransactionStatus] = useState(null);

//   const performTransaction = async () => {
//     try {
//       const response = await fetch('http://localhost:3000/perform_transaction', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({}),
//       });

//       const result = await response.json();

//       if (result.success) {
//         setTransactionStatus('Transaction successful!');
//       } else {
//         setTransactionStatus(`Error: ${result.error}`);
//       }
//     } catch (error) {
//       console.error(error);
//       setTransactionStatus('An error occurred while performing the transaction.');
//     }
//   };

  return (
    <div className='App'>
        <Navbar />
        {/* <PayBill /> */}
        <RoutePaths />
    </div>
    // <div>
    //   <h1>SimpleTransfer App</h1>
    //   <h3>Press button to pay energy bill of 0.05 ether</h3>
    //   <button onClick={performTransaction}>Perform Transaction</button>
    //   {transactionStatus && <p>{transactionStatus}</p>}
    // </div>
  );
}

export default App;
