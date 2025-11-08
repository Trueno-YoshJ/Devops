import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../components/signup.css";

export default function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleSignup = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:9090/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    if (response.ok) {
      alert("Signup successful!");
      navigate("/dashboard");
    } else {
      const error = await response.text();
      alert(error);
    }
  } catch (err) {
    console.error("Error signing up:", err);
    alert("Server error, please try again later.");
  }
};


  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <img
            src="https://img.icons8.com/ios-filled/100/4a90e2/garage.png"
            alt="Service Logo"
            className="signup-logo"
          />
          <h1>Create an Account</h1>
          <p>Sign up to access Vehicle Service Center</p>
        </div>

        <form onSubmit={handleSignup} className="signup-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="signup-btn">
            Sign Up
          </button>
        </form>

        <div className="signup-footer">
          <p>
            Already have an account?{" "}
            <a href="/login" className="login-link">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
