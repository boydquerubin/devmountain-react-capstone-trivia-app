import React, { useState, useEffect } from "react";

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
    <div className="modal">
      <div className="modal-content">
        <h2>{question.text}</h2>
        <div className="options">
          {question.options.map((option, index) => (
            <button key={index}>{option}</button>
          ))}
        </div>
        <div className="timer">Time left: {timeLeft}s</div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default QuestionModal;
