import { Link, useMatch, useResolvedPath } from "react-router-dom";

export default function Navbar() {
    const path = window.location.pathname;
    return (
        <nav className="nav">
            <Link
                to="/dashboard"
                className="site-title"
            >
                Blockchain Energy Project
            </Link>
            <ul>
                <CustomLink to="/dashboard">Home</CustomLink>
                <CustomLink to="/account-retrieval">Account Retrieval</CustomLink>
                <CustomLink to="/energy-usage">Energy Usage</CustomLink>
                <CustomLink to="/billing">Billing</CustomLink>
                <CustomLink to="/profile">Profile</CustomLink>
                <CustomLink to="/">Log Out</CustomLink>
            </ul>
        </nav>
    );
}

function CustomLink({ to, children, ...props }) {
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({path: resolvedPath.pathname, end: true})
    return (
        <li className={isActive ? "active" : ""}>
            <Link
                to={to}
                {...props}
            >
                {children}
            </Link>
        </li>
    );
}
