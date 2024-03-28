import {ethers} from "ethers";
import { useEffect, useState } from "react";
import networkMapping from "../../chain-info/deployments/map.json"
import EnergyBillingABIget from '../../chain-info/contracts/EnergyBilling.json';

const Billing = () => {
  // const transactionStatus = localStorage.getItem('transactionStatus');
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

const ConnectButton = () => {
    if(window.ethereum){
        window.ethereum.request({method: 'eth_requestAccounts'})
        .then(result => {
            accountChanged([result[0]])
        })
    }else{
        setErrorMessage('install Metamask')
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

  const reportConsumptionAndPayBill = async () => {
    if (!window.ethereum) return alert("Please install MetaMask.");

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const energyBillingContract = new ethers.Contract(energyContract, EnergyBillingABI, signer);

    try {
        // Automatically select provider for user if not already selected
        const providerSelected = await selectProviderIfNeeded(energyBillingContract, signer);
        if (!providerSelected) {
          alert('Provider selection failed. Please try again or contact support.');
          return;
        }
        // Report consumption
        const reportTx = await energyBillingContract.reportConsumption(
          peakConsumptionInWh,
          midPeakConsumptionInWh,
          offPeakConsumptionInWh
      );

        await reportTx.wait();
        // Calculate bill to be paid
        const billAmount = await energyBillingContract.calculateBill(await signer.getAddress());

        // Pay the bill
        const payTx = await energyBillingContract.payBill({ value: billAmount });
        await payTx.wait();

        alert('Bill paid successfully!');
    } catch (error) {
        console.error(error);
        alert(`Failed to process your request. Error: ${error.message}`);
    }
};

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
    <div>
      <div class="header billing-header">
        <h1>Billing for {localStorage.getItem('company')}</h1>
      </div>
      <div class="panel-body">
        <div class="row">
          <div class="col-sm-8">
            <h4 class="windowTitle">My Bills</h4>
            <table id="billsTable" width="100%" class="table table-stiped table-bordered table-hover">
              <tbody>
                <tr>
                  <td>
                    <a type="button" class="btn btn-default" href="http://localhost:3000/">
                      <img alt="ViewBillIcon" src="/images/smallPDFicon.gif" border="0"></img>     
                      View Bill
                    </a>
                    <div class="bill-link-date">
                      <strong>Jan 23, 2024</strong>
                    </div>
                    <div class="bill-link-id"> (Bill 036616598013) </div>
                  </td>
                  <td>
                    <a type="button" class="btn btn-default" href="http://localhost:3000/">
                      <img alt="ViewBillIcon" src="/images/smallPDFicon.gif" border="0"></img>     
                      View Bill
                    </a>
                    <div class="bill-link-date">
                      <strong>Jan 24, 2023</strong>
                    </div>
                    <div class="bill-link-id"> (Bill 036821852312) </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a type="button" class="btn btn-default" href="http://localhost:3000/">
                      <img alt="ViewBillIcon" src="/images/smallPDFicon.gif" border="0"></img>     
                      View Bill
                    </a>
                    <div class="bill-link-date">
                      <strong>Dec 22, 2023</strong>
                    </div>
                    <div class="bill-link-id"> (Bill 036296009740) </div>
                  </td>
                  <td>
                    <a type="button" class="btn btn-default" href="http://localhost:3000/">
                      <img alt="ViewBillIcon" src="/images/smallPDFicon.gif" border="0"></img>     
                      View Bill
                    </a>
                    <div class="bill-link-date">
                      <strong>Dec 22, 2022</strong>
                    </div>
                    <div class="bill-link-id"> (Bill 036047551069) </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a type="button" class="btn btn-default" href="http://localhost:3000/">
                      <img alt="ViewBillIcon" src="/images/smallPDFicon.gif" border="0"></img>     
                      View Bill
                    </a>
                    <div class="bill-link-date">
                      <strong>Nov 22, 2023</strong>
                    </div>
                    <div class="bill-link-id"> (Bill 036252987076) </div>
                  </td>
                  <td>
                    <a type="button" class="btn btn-default" href="http://localhost:3000/">
                      <img alt="ViewBillIcon" src="/images/smallPDFicon.gif" border="0"></img>     
                      View Bill
                    </a>
                    <div class="bill-link-date">
                      <strong>Nov 22, 2022</strong>
                    </div>
                    <div class="bill-link-id"> (Bill 036448533173) </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-sm-4">
            <h4 className="windowTitle">Pay My Bill</h4>
            <div className="panel panel-primary">
              <div className="panel-heading text-center"> Current Balance: $0.00 </div>
            </div>
            <button onClick={ConnectButton}>Connect Wallet</button>
            {defaultAccount && (
              <div>
                <h3>Address: {defaultAccount}</h3>
                <h3>Balance: {userBalance}</h3>
                <div>
                  <strong>Peak Consumption:</strong> {peakConsumption}
                </div>
                <div>
                  <strong>Mid-Peak Consumption:</strong> {midPeakConsumption}
                </div>
                <div>
                  <strong>Off-Peak Consumption:</strong> {offPeakConsumption}
                </div>
                <button onClick={reportConsumptionAndPayBill}>Report Consumption & Pay Bill</button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* <p>Transaction Successful!</p>
      <p>
        {localStorage.getItem('etherPaid')} ether has been paid.  Thank you!
      </p> */}
    </div>
  );
};

export default Billing;