const pool = require("../config/db");

export const storeScore = async (userId, score) => {
  try {
    // Check if user already has a score
    const [existingScores] = await pool.query(
      "SELECT id, score FROM scores WHERE user_id = ?",
      [userId]
    );

    if (existingScores.length > 0) {
      // Only update if the new score is different
      if (existingScores[0].score !== score) {
        await pool.query("UPDATE scores SET score = ? WHERE id = ?", [
          score,
          existingScores[0].id,
        ]);
      }
    } else {
      // Insert new score
      await pool.query("INSERT INTO scores (user_id, score) VALUES (?, ?)", [
        userId,
        score,
      ]);
    }
  } catch (error) {
    console.error("Error storing score:", error.message);
  }
};

export const recordHighScore = async (userId, score) => {
  try {
    // Fetch the current high score for the user
    const [existingScores] = await pool.query(
      "SELECT score FROM highScore WHERE user_id = ?",
      [userId]
    );

    if (existingScores.length > 0) {
      // Only update if the new score is higher
      if (score > existingScores[0].score) {
        await pool.query("UPDATE highScore SET score = ? WHERE user_id = ?", [
          score,
          userId,
        ]);
      }
    } else {
      // Insert a new high score record
      await pool.query("INSERT INTO highScore (user_id, score) VALUES (?, ?)", [
        userId,
        score,
      ]);
    }
  } catch (error) {
    console.error("Error recording high score:", error.message);
  }
};

export const fetchHighScores = async () => {
  try {
    const [highScores] = await pool.query(
      "SELECT u.username, hs.score FROM highScore hs JOIN users u ON hs.user_id = u.id ORDER BY hs.score DESC LIMIT 10"
    );
    return highScores;
  } catch (error) {
    console.error("Error fetching high scores:", error.message);
    return [];
  }
};
