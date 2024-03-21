import React, { useState } from "react";
import Select from "react-select";
import { encryptAndGenerateNonce } from "../user-authentication/encrypt";

const AccountRetrieval = (props) => {
  const [company, setCompany] = useState(null);
  const [companyError, setCompanyError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const postEncryptedData = async (encryptedPassword, nonce) => {
    const userId = localStorage.getItem('userID');
    if (!userId) {
      console.error('User ID not found in localStorage');
      return;
    }

    const postData = {
      userId,
      energyProvider: company.value,
      accountNumber: username, // Assuming 'username' is meant to be 'accountNumber'
      password: encryptedPassword,
      nonce,
    };

    const postUrl = "http://localhost:5000/energy_account_api/add_energy_data";
    try {
      const response = await fetch(postUrl, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const responseData = await response.json();
      console.log('Success:', responseData);
      // Handle success response here, possibly informing the user
    } catch (error) {
      console.error('There was a problem with your POST operation:', error);
    }
  };

  const onButtonClick = () => {
    if (!company) {
      setCompanyError("Please select your energy provider");
      return;
    }

    if (!username) {
      setUsernameError("Please enter your username");
      return;
    }

    if (!password) {
      setPasswordError("Please enter your password");
      return;
    }

    const getKeyUrl = "http://localhost:5000/vault_api/get_key";
    fetch(getKeyUrl, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(async (data) => {
      try {
        const { encryptedPassword, nonce } = await encryptAndGenerateNonce(password, data.key, data.nonce);
        console.log('Encrypted password:', encryptedPassword);
        console.log('Nonce:', nonce);
        await postEncryptedData(encryptedPassword, nonce);
      } catch (error) {
        console.error('Encryption or posting error:', error);
      }
    })
    .catch(error => {
      console.error('Error fetching key and nonce:', error);
    });
  };

  const options = [
    { value: "Alectra", label: "Alectra" },
    { value: "Toronto Hydro", label: "Toronto Hydro" },
    { value: "Oakville Hydro", label: "Oakville Hydro" },
  ];

  return (
    <div className="mainContainer">
      <div className="header">
        <h3>Retrieve info from your Energy Provider</h3>
      </div>
      <div className={"inputContainer"}>
        <Select
          defaultValue={company}
          placeholder="Pick your energy provider"
          onChange={setCompany}
          options={options}
          className={"inputSelect"}
        />
        <label className="errorLabel">{companyError}</label>
      </div>
      <br />
      <div className={"inputContainer"}>
        <input
          value={username}
          placeholder="Enter your username here"
          onChange={(ev) => setUsername(ev.target.value)}
          className={"inputBox"}
        />
        <label className="errorLabel">{usernameError}</label>
      </div>
      <br />
      <div className={"inputContainer"}>
        <input
          value={password}
          placeholder="Enter your password here"
          onChange={(ev) => setPassword(ev.target.value)}
          type="password"
          name="password"
          className={"inputBox"}
        />
        <label className="errorLabel">{passwordError}</label>
      </div>
      <br />
      <div className={"inputContainer"}>
        <input
          className={"inputButton"}
          type="button"
          onClick={onButtonClick}
          value={"Retrieve Account Info"}
        />
      </div>
    </div>
  );
};

export default AccountRetrieval;
