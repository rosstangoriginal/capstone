const Billing = () => {
  // const transactionStatus = localStorage.getItem('transactionStatus');

  return (
    <div>
      <h1>Billing</h1>
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
          <div class="col-sm-4">
            <h4 class="windowTitle">Pay My Bill</h4>
            <div class="panel panel-primary">
              <div class="panel-heading text-center"> Current Balance: $0.00 </div>
            </div>
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
