import React, {useState} from "react";
import Select from "react-select"
import { getHashedPassword } from "../user-authentication/hash";

const AccountRetrieval = (props) => {
  const [company, setCompany] = useState(null)
  const [companyError, setCompanyError] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [usernameError, setUsernameError] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const onButtonClick = () => {
      setCompanyError("")
      setUsernameError("")
      setPasswordError("")

      getAccountInfo()
  }

  const options = [
    { value: "Alectra", label: "Alectra" },
    { value: "Toronto Hydro", label: "Toronto Hydro" },
    { value: "Oakville Hydro", label: "Oakville Hydro" }
  ]

  // Retrieve account data from the user's energy provider
  const getAccountInfo = () => {
      const data = {
        company: company.value,
        username: username,
        password: getHashedPassword(password)
      }
      console.log(data)
      localStorage.setItem('company', company.value)
      localStorage.setItem('companyAuth', true)
      window.location = "/energy-usage"
  }
    
  return (
    <div className="mainContainer">
            <div class="header">
                <h3>Retrieve info from your Energy Provider</h3>
            </div>
            
            <div className={"inputContainer"}>
                <Select
                    defaultValue={company}
                    placeholder="Pick your energy provider"
                    onChange={setCompany}
                    options={options}
                    className={"inputSelect"} />
                <label className="errorLabel">{companyError}</label>
            </div>
            <br />
            <div className={"inputContainer"}>
                <input
                    value={username}
                    placeholder="Enter your username here"
                    onChange={ev => setUsername(ev.target.value)}
                    className={"inputBox"} />
                <label className="errorLabel">{usernameError}</label>
            </div>
            <br />
            <div className={"inputContainer"}>
                <input
                    value={password}
                    placeholder="Enter your password here"
                    onChange={ev => setPassword(ev.target.value)}
                    type="password"
                    name="password"
                    className={"inputBox"} />
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
  