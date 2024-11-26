const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const registerUser = async (username, email, password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user already exists
    const [existingUser] = await pool.query(
      "SELECT id FROM users WHERE email = ? OR username = ?",
      [email, username]
    );

    if (existingUser.length > 0) {
      return { success: false, error: "User already exists" };
    }

    // Insert new user
    const [result] = await pool.query(
      "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    const userId = result.insertId;

    // Insert initial score
    const [scoreResult] = await pool.query(
      "INSERT INTO scores (user_id, score) VALUES (?, 0)",
      [userId]
    );

    if (!scoreResult) {
      return { success: false, error: "Failed to initialize score" };
    }

    return { success: true, id: userId, username, email };
  } catch (error) {
    console.error("Error registering user:", error.message);
    return { success: false, error: "Server error" };
  }
};

export const loginUser = async (username, password) => {
  try {
    const [users] = await pool.query(
      "SELECT id, username, password_hash FROM users WHERE username = ?",
      [username]
    );

    if (users.length === 0) {
      return { success: false, error: "User not found" };
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return { success: false, error: "Invalid password" };
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return { success: true, token, username: user.username };
  } catch (error) {
    console.error("Error during login:", error.message);
    return { success: false, error: "Server error" };
  }
};

export const fetchHighScores = async () => {
  try {
    const response = await fetch("/api/highscores"); // Ensure this endpoint matches your backend route
    if (!response.ok) throw new Error("Failed to fetch high scores");
    const highScores = await response.json();
    return highScores;
  } catch (error) {
    console.error("Error fetching high scores:", error.message);
    return [];
  }
};
