export default (props) => {
  return (
    <div>
      <h1>Energy usage</h1>
      <p>
        {props.firstName}, your energy usage for {props.date} was{" "}
        {props.energyUsed} kWh
      </p>
    </div>
  );
};
