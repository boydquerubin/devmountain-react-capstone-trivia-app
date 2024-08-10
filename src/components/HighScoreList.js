import React, { useEffect, useState } from "react";
import { fetchHighScores } from "../services/authService";
import HighScoreCard from "./HighScoreCard";

const HighScoreList = () => {
  const [highScores, setHighScores] = useState([]);

  useEffect(() => {
    const getHighScores = async () => {
      const scores = await fetchHighScores();
      setHighScores(scores);
    };

    getHighScores();
  }, []);

  return (
    <div>
      <h2>High Scores</h2>
      {highScores.map((highScore, index) => (
        <HighScoreCard key={index} highScore={highScore} />
      ))}
    </div>
  );
};

export default HighScoreList;
