import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import Home from "./pages/home.jsx";
import Login from "./pages/login.jsx";
import Signup from "./pages/signup.jsx";
import Dashboard from "./pages/dashboard.jsx";
import "./components/navbar.css";

export default function App() {
  const location = useLocation();
  const showNavbarRoutes = ["/", "/login", "/signup"];
  const shouldShowNavbar = showNavbarRoutes.includes(location.pathname);

  return (
    <div>
      {shouldShowNavbar && (
        <nav className="navbar">
          <div className="nav-logo">AutoCare</div>
          <div className="nav-links">
            <NavLink to="/" end className="nav-item">
              Home
            </NavLink>
            <NavLink to="/login" className="nav-item">
              Login
            </NavLink>
            <NavLink to="/signup" className="nav-item">
              Signup
            </NavLink>
          </div>
        </nav>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}
