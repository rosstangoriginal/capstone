const Billing = (props) => {
  return (
    <div>
      <h1>Billing</h1>
      <p>
        {props.firstName}, your bill for {localStorage.getItem('currentEnergyUsed')} kWh was ${localStorage.getItem('currentBillPaid')} has been paid.  Thank you!
      </p>
    </div>
  );
};

export default Billing;
