// src/components/Register.js
import React, { useState } from "react";
import { registerUser } from "../services/authService";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    const user = await registerUser(email, password);
    if (user) {
      setMessage("Registration successful!");
    } else {
      setMessage(
        "Registration failed. Please check the console for more details."
      );
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
      {message && <p className="form-message">{message}</p>}
    </div>
  );
};

export default Register;
