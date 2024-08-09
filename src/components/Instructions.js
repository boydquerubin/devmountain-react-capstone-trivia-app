import React from "react";
import "./Instructions.css"; // Import the styles

const Instructions = ({ isOpen, onClose, onBegin }) => {
  if (!isOpen) return null;

  return (
    <div className="instructions-modal-overlay">
      <div className="instructions-modal-content">
        <div className="header-container">
          <h2>Welcome to Rubyx Qube!</h2>
          <h2>Game Instructions:</h2>
        </div>
        <ul>
          <li>
            <strong>Register and Login</strong> if you want to challenge the
            High Score. Otherwise, enjoy this trivia app!
          </li>
          <li>
            <strong>Score as many points</strong> as you can before time runs
            out.
          </li>

          <li>
            <strong>Select a category</strong> after each question to
            continue—questions won’t appear automatically.
          </li>
          <li>
            <strong>Press the Begin button below</strong> to start the game when
            you're ready.
          </li>
        </ul>
        <h3>Good luck!</h3>
        <button onClick={onBegin} className="begin-button">
          Begin
        </button>
        <button onClick={onClose} className="close-button">
          Close
        </button>
      </div>
    </div>
  );
};

export default Instructions;
