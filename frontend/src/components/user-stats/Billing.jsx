const Billing = () => {
  // const transactionStatus = localStorage.getItem('transactionStatus');

  return (
    <div>
      <h1>Billing</h1>
      <p>Transaction Successful!</p>
      <p>
        {localStorage.getItem('etherPaid')} ether has been paid.  Thank you!
      </p>
    </div>
  );
};

export default Billing;
