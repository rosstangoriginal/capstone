import { Fragment } from "react";

const Login = () => {
    return (
        <Fragment>
            <h1>Please enter your login info</h1>
            <form>
                <label>
                    Email/Username:
                    <input type="text" name="email" />
                </label>
                <label>
                    Password:
                    <input type="text" name="password" />
                </label>
                <input type="submit" value="Submit" />
            </form>
        </Fragment>
    )
}

export default Login;