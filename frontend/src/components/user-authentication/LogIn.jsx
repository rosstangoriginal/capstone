import { Fragment } from "react";

const Login = () => {
    return (
        <Fragment>
            <div class="header">
                <h3>Please enter your login info</h3>
            </div>
            
            <form class="login-form">
                <div class="form-element">
                   <label>
                    Email/Username:
                    <div class="form-element">
                        <input type="text" name="email" />
                    </div>
                </label> 
                </div>
                <div class="form-element">
                    <label>
                    Password:
                    <div class="form-element">
                        <input type="password" name="password" />
                    </div>
                </label>
                </div>
                <div class="form-element">
                  <input class="btn-info" type="submit" value="Submit" />  
                </div>
            </form>
        </Fragment>
    )
}

export default Login;