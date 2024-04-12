import {ethers} from "ethers";
import { Web3 } from 'web3';
import { useEffect, useState } from "react";
import networkMapping from "../../chain-info/deployments/map.json"
import EnergyBillingABIget from '../../chain-info/contracts/EnergyBilling.json';
import * as commands from './ContractCommands.js';


const Billing = () => {
  // const transactionStatus = localStorage.getItem('transactionStatus');
  const [billingHistory, setBillingHistory] = useState([]);
  const scaleKwToWh = (kw) => Math.round(kw * 1000);
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [peakConsumption, setPeakConsumption] = useState('');
  const [midPeakConsumption, setMidPeakConsumption] = useState('');
  const [offPeakConsumption, setOffPeakConsumption] = useState('');
  const energyContract = networkMapping[11155111]["EnergyBilling"][0]
  const [isProcessing, setIsProcessing] = useState(false);
  const peakConsumptionInWh = scaleKwToWh(peakConsumption);
  const midPeakConsumptionInWh = scaleKwToWh(midPeakConsumption);
  const offPeakConsumptionInWh = scaleKwToWh(offPeakConsumption);
  const [showModal, setShowModal] = useState(false);
//Will need to change to provider of costumer's network, dynamic
const providerAddress = '0xf9a0f668515Cf55393E728Cfd5c2a4b10b49d09E'
const userID = localStorage.getItem('userID');
const url = `http://127.0.0.1:5000/energy_account_api/get_energy_usage_data/${userID}`;
const EnergyBillingABI = EnergyBillingABIget.abi

const checkForProvider = () => {
  if (window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum);
  } else {
    setErrorMessage('Ethereum wallet is not available. Please install MetaMask ');
    return null;  // Return null to indicate the absence of a provider
  }
};

const ConfirmationModal = ({ onClose, isProcessing }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000, 
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '5px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {isProcessing ? (
          <div className="spinner"></div>
        ) : (
          <>
            <p>Please confirm the transaction in the MetaMask windows.</p>
            <button onClick={onClose} style={{ marginTop: '10px' }}>Okay</button>
          </>
        )}
      </div>
    </div>
  );
};

useEffect(() => {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.energyUsage && data.energyUsage.length > 0) {
        const [usageData] = data.energyUsage;
        setPeakConsumption(usageData[0]);  
        setMidPeakConsumption(usageData[1]); 
        setOffPeakConsumption(usageData[2]);
      }
    })
    .catch(error => {
      console.error("Failed to fetch energy usage data:", error);
      setErrorMessage("Failed to fetch energy usage data.");
    });
}, [userID]); // Rerun the effect if userID changes

//logic to fetch user billing information
const fetchBillingHistory = async (account) => {
  const provider1 = checkForProvider();
  if (!provider1) return;
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const energyBillingContract = new ethers.Contract(energyContract, EnergyBillingABI, signer);

  try {
    const balance = await provider.getBalance(account);
    setUserBalance(ethers.utils.formatEther(balance));

    // Fetch billing history function here
    const filter = energyBillingContract.filters.BillPaid(account);
    const events = await energyBillingContract.queryFilter(filter);
    const historyWithDetails = await Promise.all(events.map(async (event) => {
      const txReceipt = await provider.getTransactionReceipt(event.transactionHash);
      const tx = await provider.getTransaction(event.transactionHash);
      const block = await provider.getBlock(tx.blockNumber);
      const timestamp = new Date(block.timestamp * 1000);
      return {
        amount: ethers.utils.formatEther(event.args.amount),
        date: timestamp.toLocaleString(),
        transactionHash: txReceipt.transactionHash,
      };
    }));
    setBillingHistory(historyWithDetails);
  } catch (error) {
    console.error("An error occurred:", error);
    setErrorMessage("Failed to fetch billing history.");
  }
};
//Useeffect to update billing information after payment
useEffect(() => {
  const provider1 = checkForProvider();
  if (!provider1) return;
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const energyBillingContract = new ethers.Contract(energyContract, EnergyBillingABI, signer);

  const onBillPaid = (user, amount, event) => {
    if (user.toLowerCase() === defaultAccount?.toLowerCase()) {
      if (!billingHistory.some(bill => bill.transactionHash === event.transactionHash)) {
        const newBill = {
          date: new Date().toLocaleString(),
          amount: ethers.utils.formatEther(amount),
          transactionHash: event.transactionHash,
        };
        setBillingHistory(prevHistory => [...prevHistory, newBill]);
      }
    }
  };

  energyBillingContract.on('BillPaid', onBillPaid);

  return () => {
    energyBillingContract.off('BillPaid', onBillPaid);
  };
}, [defaultAccount, EnergyBillingABI, energyContract]);

//Button to connect user's metamask wallet
const ConnectButton = () => {
  const provider = checkForProvider();
  if (!provider) return;
  if (window.ethereum) {
    window.ethereum.request({ method: 'eth_requestAccounts' })
      .then(result => {
        accountChanged(result[0]);
        fetchBillingHistory(result[0]); // Call fetchBillingHistory when account is connected
      })
      .catch(error => {
        setErrorMessage('There was an error connecting the wallet.');
      });
  } else {
    setErrorMessage('Please install MetaMask.');
  }
  };
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

//May remove payment window confirmation as metmask already asks for confirmation
const reportConsumptionAndPayBill = async () => {
  if (!window.ethereum) return alert("Please install MetaMask.");
  const web3 = new Web3(window.ethereum);

  setShowModal(true);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const energyBillingContract = new ethers.Contract(energyContract, EnergyBillingABI, signer);

  try {
    let abi = commands.getABI();
    let contractBytecode = commands.getBytecode('EnergyBilling/bytecode2.txt');
    let contractAddress = await commands.deployCommand(contractBytecode);

    const providerSelected = await selectProviderIfNeeded(web3, signer, abi, contractAddress);
    if (!providerSelected) {
      setShowModal(false);
      alert('Provider selection failed. Please try again or contact support.');
      return;
    }

    //reportConsumption
    let reportConsumptionHash = commands.getFunctionHash("reportConsumption", [await signer.getAddress(), peakConsumptionInWh, midPeakConsumptionInWh, offPeakConsumptionInWh], web3, abi);
    let reportConsumptionResponse = await commands.invokeSmartContract(contractAddress, reportConsumptionHash);

    setIsProcessing(true);
    let calculateBillHash = commands.getFunctionHash("calculateBill", [await signer.getAddress()], web3, abi);
    let calculateBillResponse = await commands.querySmartContract(contractAddress, calculateBillHash);
    let billAmount = parseInt(calculateBillResponse.StandardOutputContent.replace("\n", ""), 16);

    const payTx = await energyBillingContract.payBill({ value: billAmount });
    const receipt = await payTx.wait();
    
    const updatedBalance = await provider.getBalance(defaultAccount);
    setUserBalance(ethers.utils.formatEther(updatedBalance));
    setIsProcessing(false);

  } catch (error) {
    console.error(error);
    alert(`Failed to process your request. Error: ${error.message}`);
  } finally {
    setIsProcessing(false);
    setShowModal(false); // Ensure modal is hidden after processing
  }
};

//use this logic to send funds to selected provider account, may change 
const selectProviderIfNeeded = async (web3, signer, abi, contractAddress) => {
  try {
    const userAddress = await signer.getAddress();
    let userToProviderHash = commands.getFunctionHash("userToProvider", [userAddress], web3, abi);
    let userToProviderResponse = await commands.querySmartContract(contractAddress, userToProviderHash);
    let userProvider = userToProviderResponse.StandardOutputContent.replace("\n", "");
    if (parseInt(userProvider, 16) === 0) {
      let selectProviderHash = commands.getFunctionHash("selectProvider", [userAddress, providerAddress], web3, abi);
      let selectProviderResponse = await commands.invokeSmartContract(contractAddress, selectProviderHash);

      let userToProviderHash = commands.getFunctionHash("userToProvider", [userAddress], web3, abi);
      let userToProviderResponse = await commands.querySmartContract(contractAddress, userToProviderHash);
      let userProvider = userToProviderResponse.StandardOutputContent.replace("\n", "");
    }
    return parseInt(userProvider, 16) !== 0
  } catch (error) {
    console.error('Error in selecting provider:', error);
    return false;
  }
};

//Spinner model for confirmation


return (
  <div className="container-fluid">
    <div className="header billing-header">
      <h1>Billing for {localStorage.getItem('company')}</h1>
    </div>
    {errorMessage && <p className="error-message">{errorMessage}</p>}
    <div className="row">
      <div className="col-md-8">
        <h4 className="windowTitle">My Bills</h4>
        {billingHistory.length > 0 ? (
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {billingHistory.map((bill, index) => (
              <div key={index} className="col">
                <div className="card">
                  <div className="card-body">
                    <h6 className="card-subtitle mb-2 text-muted">Date: {bill.date}</h6>
                    <p className="card-text">Amount: {bill.amount} ETH</p>
                    <a href={`https://sepolia.etherscan.io/tx/${bill.transactionHash}`} target="_blank" rel="noopener noreferrer" className="card-link">View Bill</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>No billing history found.</div>
        )}
      </div>
      <div className="col-md-4">
        <div className="card mb-3">
          <div className="card-header">Wallet Information</div>
          <div className="card-body">
            <button onClick={ConnectButton} className="btn btn-primary w-100 mb-3">Connect Wallet</button>
            {defaultAccount && (
              <>
                <p><strong>Address:</strong> {defaultAccount}</p>
                <p><strong>Balance:</strong> {userBalance} ETH</p>
              </>
            )}
            <p><strong>Peak Consumption:</strong> {peakConsumption} kW</p>
            <p><strong>Mid-Peak Consumption:</strong> {midPeakConsumption} kW</p>
            <p><strong>Off-Peak Consumption:</strong> {offPeakConsumption} kW</p>
            <button onClick={reportConsumptionAndPayBill} className="btn btn-success w-100" disabled={isProcessing}>
              {isProcessing ? 'Processing...' : 'Report Consumption & Pay Bill'}
            </button>
          </div>
        </div>
      </div>
    </div>
    {showModal && <ConfirmationModal onClose={() => setShowModal(false)} isProcessing={isProcessing} />}
  </div>
);





};

export default Billing;