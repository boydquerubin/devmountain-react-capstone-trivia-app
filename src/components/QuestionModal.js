import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./QuestionModal.css"; // Import the correct CSS file

const QuestionModal = ({ question, isOpen, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="timer">Time left: {timeLeft}s</div>
        <h2>{question.text}</h2>
        <div className="options">
          {question.options.map((option, index) => (
            <button key={index}>{option}</button>
          ))}
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

QuestionModal.propTypes = {
  question: PropTypes.shape({
    text: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default QuestionModal;
