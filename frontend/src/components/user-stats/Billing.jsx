import {ethers} from "ethers";
import { useEffect, useState } from "react";
import networkMapping from "../../chain-info/deployments/map.json"
import EnergyBillingABIget from '../../chain-info/contracts/EnergyBilling.json';

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

  const peakConsumptionInWh = scaleKwToWh(peakConsumption);
  const midPeakConsumptionInWh = scaleKwToWh(midPeakConsumption);
  const offPeakConsumptionInWh = scaleKwToWh(offPeakConsumption);
//Will need to change to provider of costumer's network, dynamic
const providerAddress = '0xf9a0f668515Cf55393E728Cfd5c2a4b10b49d09E'
const userID = localStorage.getItem('userID');
const url = `http://127.0.0.1:5000/energy_account_api/get_energy_usage_data/${userID}`;
const EnergyBillingABI = EnergyBillingABIget.abi

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

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const energyBillingContract = new ethers.Contract(energyContract, EnergyBillingABI, signer);

  try {
    const providerSelected = await selectProviderIfNeeded(energyBillingContract, signer);
    if (!providerSelected) {
      alert('Provider selection failed. Please try again or contact support.');
      return;
    }

    const reportTx = await energyBillingContract.reportConsumption(
      peakConsumptionInWh,
      midPeakConsumptionInWh,
      offPeakConsumptionInWh
    );
    await reportTx.wait();

    const billAmount = await energyBillingContract.calculateBill(await signer.getAddress());
    const confirmPayment = window.confirm(`The bill amount is ${ethers.utils.formatEther(billAmount)} ETH. Do you want to proceed with payment?`);
    if (!confirmPayment) {
      return;
    }

    const payTx = await energyBillingContract.payBill({ value: billAmount });
    const receipt = await payTx.wait();
    
    const updatedBalance = await provider.getBalance(defaultAccount);
    setUserBalance(ethers.utils.formatEther(updatedBalance));


  } catch (error) {
    console.error(error);
    alert(`Failed to process your request. Error: ${error.message}`);
  }
};

//use this logic to send funds to selected provider account, may change 
const selectProviderIfNeeded = async (contract, signer) => {
  try {
    const userAddress = await signer.getAddress();
    let userProvider = await contract.userToProvider(userAddress);
    if (userProvider === ethers.constants.AddressZero) {
      const tx = await contract.selectProvider(providerAddress, { from: userAddress });
      await tx.wait();  
      userProvider = await contract.userToProvider(userAddress);
    }
    return userProvider !== ethers.constants.AddressZero;
  } catch (error) {
    console.error('Error in selecting provider:', error);
    return false;
  }
};

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
            <button onClick={reportConsumptionAndPayBill} className="btn btn-success w-100">Report Consumption & Pay Bill</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);





};

export default Billing;