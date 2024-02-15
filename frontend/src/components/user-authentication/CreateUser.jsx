// import { Fragment } from "react";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom"

// useEffect(() => {
//     // Fetch the user email and token from local storage
//     const user = JSON.parse(localStorage.getItem("user"))
  
//     // If the token/email does not exist, mark the user as logged out
//     if (!user || !user.token) {
//       setLoggedIn(false)
//       return
//     }
  
//     // If the token exists, verify it with the auth server to see if it is valid
//     fetch("http://localhost:3080/verify", {
//             method: "POST",
//             headers: {
//                 'jwt-token': user.token
//               }
//         })
//         .then(r => r.json())
//         .then(r => {
//             setLoggedIn('success' === r.message)
//             setEmail(user.email || "")
//         })
//   }, [])

const CreateUser = (props) => {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [accountNum, setAccountNum] = useState("")
    const [firstNameError, setFirstNameError] = useState("")
    const [lastNameError, setLastNameError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [accountNumError, setAccountNumError] = useState("")

    const navigate = useNavigate();

    // change this for the submission of a new user
    const onButtonClick = () => {
        setFirstNameError("")
        setLastNameError("")
        setEmailError("")
        setPasswordError("")
        setAccountNumError("")

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

        createAccount()
        // Check if email has an account associated with it
        //  checkAccountExists(accountExists => {
        //     // If yes, log in 
        //     if (!accountExists)
        //         createAccount()
        //     else
        //     // Else, ask user if they want to create a new account and if yes, then log in
        //         setEmailError("User with this email address already exists")
        // })
    }

    const onButtonClickGoLogin = () => {
        window.location = "/"
    }

    // *** this functionality has not been tested yet
    // Call the server API to check if the given email ID already exists
    const checkAccountExists = (callback) => {
        fetch("http://localhost:3080/check-account", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({email})
        })
        .then(r => r.json())
        .then(r => {
            callback(r?.userExists)
        })
    }

    // Log in a user using email and password
    // const logIn = () => {
    //     fetch("http://localhost:3080/auth", {
    //         method: "POST",
    //         headers: {
    //             'Content-Type': 'application/json'
    //           },
    //         body: JSON.stringify({email, password})
    //     })
    //     .then(r => r.json())
    //     .then(r => {
    //         if ('success' === r.message) {
    //             localStorage.setItem("user", JSON.stringify({email, token: r.token}))
    //             props.setLoggedIn(true)
    //             props.setEmail(email)
    //             navigate("/dashboard")
    //         } else {
    //             window.alert("Wrong email or password")
    //         }
    //     })
    // }

    // Create a user account with the given info
    const createAccount = () => {
        // fill with code
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
                    value={accountNum}
                    placeholder="Account Number"
                    onChange={ev => setAccountNum(ev.target.value)}
                    className={"inputBox"} />
                <label className="errorLabel">{accountNumError}</label>
            </div>
            <br />
            <div className={"inputContainer"}>
                <input
                    className={"inputButton"}
                    type="button"
                    onClick={onButtonClick}
                    value={"Create User"} 
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