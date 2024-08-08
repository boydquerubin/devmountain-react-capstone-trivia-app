import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import { supabase } from "./supabaseClient"; // Import supabase client
import { logoutUser } from "./services/authService"; // Import logout function
import logo from "./assets/logo.png"; // Import the logo
import Footer from "./components/Footer"; // Import the Footer component
import "./App.css"; // Import the CSS file for styling

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
    await logoutUser();
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
        <Route
          path="/"
          element={user ? <Home user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <Register />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <Login onLogin={setUser} />}
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
