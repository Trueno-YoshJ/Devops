import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../components/login.css";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:9090/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      alert("Login successful!");
      navigate("/dashboard");
    } else {
      const error = await response.text();
      alert(error);
    }
  } catch (err) {
    console.error("Error logging in:", err);
    alert("Server error, please try again later.");
  }
};

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img
            src="https://img.icons8.com/ios-filled/100/4a90e2/car-service.png"
            alt="Service Logo"
            className="login-logo"
          />
          <h1>Vehicle Service Center</h1>
          <p>Login to manage your services</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don’t have an account?{" "}
            <a href="/signup" className="signup-link">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
