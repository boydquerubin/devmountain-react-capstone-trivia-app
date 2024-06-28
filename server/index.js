require("dotenv").config(); // Load environment variables

const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000; // Use PORT from environment with a fallback

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use the database URL from environment
});

// Function to test database connection
async function testDbConnection() {
  try {
    const res = await pool.query("SELECT NOW()"); // Query to get current time from database
    console.log("Database connection successful:", res.rows[0]);
    return true;
  } catch (err) {
    console.error("Database connection failed:", err);
    return false;
  }
}

// API endpoint to test database connection
app.get("/test-db", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT NOW()");
    res.send(`Database connected! Current server time is: ${rows[0].now}`);
  } catch (err) {
    res.status(500).send("Failed to connect to the database.");
  }
});

// Start server and call test function after server starts
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  testDbConnection();
});
