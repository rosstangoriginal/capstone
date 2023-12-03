import { Route, Routes } from "react-router-dom";
import Dashboard from "./landing-page/Dashboard";
import CreateUser from "./user-authentication/CreateUser";
import LogIn from "./user-authentication/LogIn";
import SetNewPassword from "./user-authentication/SetNewPassword";
import Billing from "./user-stats/Billing";
import EnergyUsage from "./user-stats/EnergyUsage";

export default () => {
    return (
        
                <Routes>
                    <Route path="/" element={<LogIn />} />
                    <Route path="/create-user" element={<CreateUser />} />
                    <Route path="/set-new-password" element={<SetNewPassword />} /> 
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/billing" element={<Billing />} />
                    <Route path="/energy-usage" element={<EnergyUsage />} />
                </Routes>
            
    )
}