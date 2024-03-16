import { Fragment } from "react";

const Dashboard = () => {
    return (
        <Fragment>
            <div>
                <div class="header">
                    <h1>Welcome {localStorage.getItem('firstName')}</h1>
                </div>
                <div class="table-responsive">
                    <div class="panel-title" align="left">
                    You are viewing account # 
                    <strong>{localStorage.getItem('accountNum')}</strong>
                    </div>
                    <div class="panel-body">
                        <table width="100%">
                            <tbody>
                                <tr>
                                    <td valign="top" align="left" nowrap>
                                        <strong>Account Name:</strong>
                                    </td>
                                    <td align="left">
                                        {localStorage.getItem('firstName')} {localStorage.getItem('lastName')}
                                    </td>
                                    <td valign="top" align="left" nowrap>
                                        <strong>Preferred Phone #:</strong>
                                    </td>
                                    <td align="left">
                                        (647) 123 - 4567
                                    </td>
                                </tr>
                                <tr>
                                    <td valign="top" align="left" nowrap>
                                        <strong>Service Location:</strong>
                                    </td>
                                    <td align="left">
                                        123 Deathstar Drive
                                    </td>
                                    <td valign="top" align="left" nowrap>
                                        <strong>Balance:</strong>
                                    </td>
                                    <td align="left">
                                        $ 230.17
                                    </td>
                                </tr>
                                <tr>
                                    <td valign="top" align="left" nowrap>
                                        <strong>Pay Plan:</strong>
                                    </td>
                                    <td align="left">
                                        Auto Pay
                                    </td>
                                    <td colspn="2">
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="panel-body center-text panel-dashboard-btn">
                    <a id="retrieveAccount" type="button" class="btn btn-info btn-dashboard" href="http://localhost:3000/account-retrieval">
                    Retrieve Account
                    </a>  
                    
                    <a id="viewEnergyUsage" type="button" class="btn btn-info btn-dashboard" href="http://localhost:3000/energy-usage">
                    View Energy Usage
                    </a>
                
                    <a id="viewBilling" type="button" class="btn btn-info btn-dashboard" href="http://localhost:3000/billing">
                    View Current Bill
                    </a>                    
                </div>
            </div>
        </Fragment>
    )
}

export default Dashboard;