import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Update from "./pages/Update";
import Register from "./components/Register";
import Login from "./components/Login";
import logo from "./assets/logo.png"; // Import the logo

function App() {
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

          <Link to="/">Home</Link>
          <Link to="/create">Create New Category</Link>
        </div>
        <div className="auth-buttons">
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/:id" element={<Update />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
