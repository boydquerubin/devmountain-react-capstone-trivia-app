import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./QuestionModal.css"; // Import the correct CSS file

const QuestionModal = ({ question, isOpen, onClose, onSkip }) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleClose(false); // Close the modal and mark the answer as incorrect if time runs out
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    const isCorrect =
      selectedOption === question.options[question.options.length - 1]; // Assuming the last option is always correct
    handleClose(isCorrect);
  };

  const handleClose = (isCorrect) => {
    setSelectedOption(null); // Reset selected option
    setTimeLeft(30); // Reset timer
    onClose(isCorrect); // Pass the result to the parent component
  };

  const handleSkip = () => {
    setSelectedOption(null); // Reset selected option
    setTimeLeft(30); // Reset timer
    onSkip(); // Skip to the next question
  };

  if (!isOpen || !question) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="exit-button" onClick={() => handleClose(false)}>
          Exit
        </button>
        <div className="timer">Time left: {timeLeft}s</div>
        <h2>{question.text}</h2>
        <div className="options">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              className={selectedOption === option ? "selected" : ""}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="modal-buttons">
          <button onClick={handleSubmit} disabled={selectedOption === null}>
            Submit
          </button>
          <button onClick={handleSkip}>Skip Question</button>
        </div>
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
  onSkip: PropTypes.func.isRequired,
};

export default QuestionModal;
