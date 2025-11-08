import React from "react";
import { useNavigate } from "react-router-dom";
import "../components/dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <button onClick={handleLogout} className="logout-btn">Logout</button>
        <img
          src="https://img.icons8.com/ios-filled/100/4a90e2/maintenance.png"
          alt="Dashboard Logo"
          className="dashboard-logo"
        />
        <h1>Welcome to Your Dashboard</h1>
        <p>Manage your vehicle services in one place</p>
      </div>

      <div className="dashboard-cards">
        <div className="card">
          <h2>📅 Upcoming Services</h2>
          <p>No services scheduled yet.</p>
        </div>
        <div className="card">
          <h2>🛠 Service History</h2>
          <p>Track all your completed services here.</p>
        </div>
        <div className="card">
          <h2>👤 Profile</h2>
          <p>Manage your account and settings.</p>
        </div>
      </div>
    </div>
  );
}
