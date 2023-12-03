export default (props) => {
  return (
    <div>
      <h1>Billing</h1>
      <p>
        {props.firstName}, your bill for {props.date} was ${props.amount}
      </p>
    </div>
  );
};
