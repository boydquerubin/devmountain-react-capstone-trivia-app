import React, { useState } from "react";
import { useHistory } from "react-router-dom"; // Import useHistory hook
import { loginUser } from "../services/authService";
import "./Login.css"; // Import the CSS file for styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const history = useHistory(); // Initialize useHistory

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!email || !password) {
      setMessage("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const user = await loginUser(email, password);
      if (user) {
        setMessage("Login successful!");
        onLogin(user);
        history.push("/"); // Redirect to home page
      } else {
        setMessage("Login failed. Please check the console for more details.");
      }
    } catch (error) {
      console.error("Unexpected error during login:", error);
      setMessage("Login failed. Please try again later.");
    }

    setLoading(false);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="password-container">
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span onClick={togglePasswordVisibility} className="password-toggle">
            <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
          </span>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      {message && <p className="form-message">{message}</p>}
    </div>
  );
};

export default Login;
