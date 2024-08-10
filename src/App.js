import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import { supabase } from "./supabaseClient";
import { logoutUser } from "./services/authService"; // Import logoutUser
import logo from "./assets/logo.png";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data) {
        setUser(data.user);
      } else {
        console.error("Error fetching user:", error?.message);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await logoutUser(); // Use logoutUser
    setUser(null);
  };

  return (
    <BrowserRouter>
      <nav>
        <div className="nav-links">
          <Link to="/" className="navbar-brand mb-0 h1">
            <img
              src={logo}
              width="60"
              height="60"
              alt="Rubyx Qube Logo"
              className="logo"
            />
            <h1>Rubyx Qube</h1>
          </Link>
        </div>
        <div className="auth-buttons">
          {user ? (
            <>
              <span>Welcome, {user.email}</span>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/register">Register</Link>
              <Link to="/login">Login</Link>
            </>
          )}
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login onLogin={setUser} />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
