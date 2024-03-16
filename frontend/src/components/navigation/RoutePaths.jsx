import { Route, Routes } from "react-router-dom";
import Dashboard from "../landing-page/Dashboard";
import CreateUser from "../user-authentication/CreateUser";
import LogIn from "../user-authentication/LogIn";
import SetNewPassword from "../user-authentication/SetNewPassword";
import Billing from "../user-stats/Billing";
import EnergyUsage from "../user-stats/EnergyUsage";
import Profile from "../user-stats/Profile";
import AccountRetrieval from "../user-stats/AccountRetrieval";

const RoutePaths = () => {
  return (
        <Routes>
          <Route path="/" element={<LogIn />} />
          <Route path="/create-user" element={<CreateUser />} />
          <Route path="/set-new-password" element={<SetNewPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/billing"
            element={
              <Billing firstName="Darth" date="16-Nov-2023" amount="100.00" />
            }
          />
          <Route
            path="/energy-usage"
            element={
              <EnergyUsage
                firstName="Darth"
                date="16-Nov-2023"
                energyUsed="50"
              />
            }
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/account-retrieval" element={<AccountRetrieval />} />
        </Routes>
  );
};

export default RoutePaths;