import React, {useState} from "react";
import { getHashedPassword } from "./hash";

const Login = (props) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")

    const onButtonClick = () => {
        setEmailError("")
        setPasswordError("")

        if("" === email) {
            setEmailError("Please enter your email")
            return
        }

        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            setEmailError("Please enter a valid email")
            return
        }

        if ("" === password) {
            setPasswordError("Please enter a password")
            return
        }

        if (password.length < 7) {
            setPasswordError("The password must be 8 characters or longer")
            return
        }

        logIn()
    }

    const onButtonClickCreateUser = () => {
        window.location = "/create-user"
    }

    // Log in a user using email and password
    const logIn = () => {
        localStorage.clear()
        
        const data = {
            email: email,
            password: getHashedPassword(password)
        }      

        // *** url is subject to change when we know where the backend is hosted and on what port
        const url = "http://127.0.0.1:5000/login_api/login"
       
        fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(data)
        })
        .then(r => r.json())
        .then(r => {
            if ('Login successful.' === r.message) {
                localStorage.setItem('firstName', r.firstName)
                localStorage.setItem('lastName', r.lastName)
                localStorage.setItem('email', r.email)
                localStorage.setItem('userID', r.userId)
                window.location = "/dashboard"
            } else {
                window.alert("Wrong email or password")
            }
        })
    }

    return (
        <div className="mainContainer">
            <div class="header">
                <h3>Please enter your login info</h3>
            </div>
            
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
                    value={"Log in"} 
                />
                <br />
                <input 
                    className={"inputButton"}
                    type="button"
                    onClick={onButtonClickCreateUser}
                    value={"Create User"}
                />
            </div>
        </div>
    )
}

export default Login;