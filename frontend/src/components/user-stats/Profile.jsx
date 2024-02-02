import { Fragment } from "react";

const Profile = () => {
    return (
        <Fragment>
            <div>
                <div class="table-responsive">
                    <div class="profile-header">
                        <h2>This is your acount profile Darth</h2>
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
                                        123456789
                                    </td>
                                    <td colspn="2">
                                    </td>
                                </tr>
                                <tr class="spaceUnder">
                                    <td valign="top" align="left" nowrap>
                                        <strong>First Name:</strong>
                                    </td>
                                    <td align="left">
                                        Darth
                                    </td>
                                    <td colspn="2">
                                    </td>
                                </tr>
                                <tr class="spaceUnder">
                                    <td valign="top" align="left" nowrap>
                                        <strong>Last Name:</strong>
                                    </td>
                                    <td align="left">
                                        Vader
                                    </td>
                                    <td colspn="2">
                                    </td>
                                </tr>
                                <tr class="spaceUnder">
                                    <td valign="top" align="left" nowrap>
                                        <strong>Email Address:</strong>
                                    </td>
                                    <td align="left">
                                        Darth.Vader@gmail.com
                                    </td>
                                    <td colspn="2">
                                    </td>
                                </tr>
                                <tr class="spaceUnder">
                                    <td valign="top" align="left" nowrap>
                                        <strong>Home Address:</strong>
                                    </td>
                                    <td align="left">
                                        123 Deathstar Drive
                                    </td>
                                    <td colspn="2">
                                    </td>
                                </tr>
                                <tr class="spaceUnder">
                                    <td valign="top" align="left" nowrap>
                                        <strong>Phone #:</strong>
                                    </td>
                                    <td align="left">
                                        (647) 123 - 4567
                                    </td>
                                    <td colspn="2">
                                    </td>
                                </tr>
                                <tr class="spaceUnder">
                                    <td valign="top" align="left" nowrap>
                                        <strong>Challenge Question:</strong>
                                    </td>
                                    <td align="left">
                                        Who was your 3rd grade teacher?
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