import React, {useState} from "react";
import { getHashedPassword } from "./hash"

const CreateUser = (props) => {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [firstNameError, setFirstNameError] = useState("")
    const [lastNameError, setLastNameError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")

    const onButtonClick = () => {
        setFirstNameError("")
        setLastNameError("")
        setEmailError("")
        setPasswordError("")

        if("" === firstName) {
            setFirstNameError("Required: first name")
            return
        }

        if("" === lastName) {
            setLastNameError("Required: last name")
            return
        }

        if("" === email) {
            setEmailError("Required: email")
            return
        }

        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            setEmailError("Please enter a valid email")
            return
        }

        if ("" === password) {
            setPasswordError("Required: password")
            return
        }

        if (password.length < 7) {
            setPasswordError("The password must be 8 characters or longer")
            return
        }

        createAccount()
    }

    const onButtonClickGoLogin = () => {
        window.location = "/"
    }

    // Create a user account with the given info
    const createAccount = () => {
        const data = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: getHashedPassword(password)
        }

        // *** url is subject to change when we know where the backend is hosted and on what port
        const url = "http://127.0.0.1:5000/create_account_api/create_account"
        const options = {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
            },
            body: JSON.stringify(data),
        }
        fetch(url, options)
            .then(response => response.json())
            .then(response => {
                if ('Account created successfully' === response.message) {
                    localStorage.setItem('userID', response.user_id)
                    window.location = "/account-retrieval"
                } else {
                    window.alert("Profile could not be created")
                }
            })
            .catch(error => {
                if (error.response) {
                    this.posts = null
                    this.errorData = error.response.data
                    this.fieldCheck = null
                }
            })
    }

    return (
        <div className="mainContainer">
            <div class="header">
                <h3>Please enter your info to create your new User profile</h3>
            </div>
            
            <div className={"inputContainer"}>
                <input
                    value={firstName}
                    placeholder="First Name"
                    onChange={ev => setFirstName(ev.target.value)}
                    className={"inputBox"} />
                <label className="errorLabel">{firstNameError}</label>
            </div>
            <br />
            <div className={"inputContainer"}>
                <input
                    value={lastName}
                    placeholder="Last Name"
                    onChange={ev => setLastName(ev.target.value)}
                    className={"inputBox"} />
                <label className="errorLabel">{lastNameError}</label>
            </div>
            <br />
            <div className={"inputContainer"}>
                <input
                    value={email}
                    placeholder="Enter your email here"
                    onChange={ev => setEmail(ev.target.value)}
                    className={"inputBox"} />
                <label className="errorLabel">{emailError}</label>
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
                    value={"Create User Profile"} 
                />
                <br />
                <input
                    className={"inputButton"}
                    type="button"
                    onClick={onButtonClickGoLogin}
                    value={"Already a User? Login"}
                />
            </div>
        </div>
    )
}

export default CreateUser;