import React, { useState } from "react";
import PropTypes from "prop-types";
import "./QuestionModal.css"; // Import the correct CSS file

const QuestionModal = ({ question, isOpen, onClose, onSkip }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    const isCorrect = selectedOption === question.correctAnswer;
    if (isCorrect) {
      setFeedbackMessage("Correct!");
    } else {
      setFeedbackMessage("Incorrect, go again!");
    }
    setTimeout(() => handleClose(isCorrect), 1000); // Show message for 1 second before closing
  };

  const handleClose = (isCorrect) => {
    setSelectedOption(null); // Reset selected option
    setFeedbackMessage(""); // Reset feedback message
    onClose(isCorrect); // Pass the result to the parent component
  };

  const handleSkip = () => {
    setSelectedOption(null); // Reset selected option
    setFeedbackMessage(""); // Reset feedback message
    onSkip(); // Skip to the next question
  };

  if (!isOpen || !question) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="exit-button" onClick={() => handleClose(false)}>
          Exit
        </button>
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
        {feedbackMessage && (
          <p
            className={`feedback-message ${
              feedbackMessage === "Correct!" ? "correct" : "incorrect"
            }`}
          >
            {feedbackMessage}
          </p>
        )}
      </div>
    </div>
  );
};

QuestionModal.propTypes = {
  question: PropTypes.shape({
    text: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    correctAnswer: PropTypes.string.isRequired, // Add correctAnswer to the question shape
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSkip: PropTypes.func.isRequired,
};

export default QuestionModal;
