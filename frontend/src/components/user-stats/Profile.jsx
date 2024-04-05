import { Fragment } from "react";

const Profile = () => {
    return (
        <Fragment>
            <div>
                <div class="table-responsive">
                    <div class="header profile-header">
                        <h1>This is your acount profile {localStorage.getItem('firstName')}</h1>
                    </div>
                    <div class="panel-title" align="left">
                        <strong>My Account Profile </strong>
                    </div>
                    <div class="panel-body">
                        <table width="100%">
                            <tbody>
                                <tr class="spaceUnder">
                                    <td valign="top" align="left" nowrap>
                                        <strong>Account Number:</strong>
                                    </td>
                                    <td align="left">
                                        {localStorage.getItem('accountNum')}
                                    </td>
                                    <td colspn="2">
                                    </td>
                                </tr>
                                <tr class="spaceUnder">
                                    <td valign="top" align="left" nowrap>
                                        <strong>First Name:</strong>
                                    </td>
                                    <td align="left">
                                        {localStorage.getItem('firstName')}
                                    </td>
                                    <td colspn="2">
                                    </td>
                                </tr>
                                <tr class="spaceUnder">
                                    <td valign="top" align="left" nowrap>
                                        <strong>Last Name:</strong>
                                    </td>
                                    <td align="left">
                                        {localStorage.getItem('lastName')}
                                    </td>
                                    <td colspn="2">
                                    </td>
                                </tr>
                                <tr class="spaceUnder">
                                    <td valign="top" align="left" nowrap>
                                        <strong>Email Address:</strong>
                                    </td>
                                    <td align="left">
                                        {localStorage.getItem('email')}
                                    </td>
                                    <td colspn="2">
                                    </td>
                                </tr>
                                <tr class="spaceUnder">
                                    <td valign="top" align="left" nowrap>
                                        <strong>Energy Provider:</strong>
                                    </td>
                                    <td align="left">
                                        {localStorage.getItem('energyProvider')}
                                    </td>
                                    <td colspn="2">
                                    </td>
                                </tr>
                                <tr class="spaceUnder">
                                    <td valign="top" align="left" nowrap>
                                        <strong>Account Number:</strong>
                                    </td>
                                    <td align="left">
                                        {localStorage.getItem('accountNum')}
                                    </td>
                                    <td colspn="2">
                                    </td>
                                </tr>
                                <tr class="spaceUnder">
                                    <td valign="top" align="left" nowrap>
                                        <strong>Home Address:</strong>
                                    </td>
                                    <td align="left">
                                        {localStorage.getItem('address')}
                                    </td>
                                    <td colspn="2">
                                    </td>
                                </tr>
                                <tr class="spaceUnder">
                                    <td valign="top" align="left" nowrap>
                                        <strong>Account Name:</strong>
                                    </td>
                                    <td align="left">
                                        {localStorage.getItem('accountName')}
                                    </td>
                                    <td colspn="2">
                                    </td>
                                </tr>
                                <tr class="spaceUnder">
                                    <td valign="top" align="left" nowrap>
                                        <strong>Phone #:</strong>
                                    </td>
                                    <td align="left">
                                        {localStorage.getItem('phoneNum')}
                                    </td>
                                    <td colspn="2">
                                    </td>
                                </tr>           
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="panel-body center-text">
                    <a id="viewEnergyUsage" type="button" class="btn btn-info" href="http://localhost:3000/">
                        Edit Profile
                    </a>
                </div>
            </div>
        </Fragment>
    )
}

export default Profile;