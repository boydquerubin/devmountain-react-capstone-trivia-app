import React from "react";
import PropTypes from "prop-types";
import "./HighScoreCard.css";

const HighScoreCard = ({ highScore }) => {
  return (
    <div className="high-score-title-box">
      <h2>High Score</h2>
      <div className="high-score-card">
        <h3>{highScore.title}</h3>
        <div className="score">{highScore.score}</div>
      </div>
    </div>
  );
};

HighScoreCard.propTypes = {
  highScore: PropTypes.shape({
    title: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
  }).isRequired,
};

export default HighScoreCard;
