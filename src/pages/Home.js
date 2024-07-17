import { useEffect, useState } from "react";
import HighScoreCard from "../components/HighScoreCard";
import Categories from "../components/Categories";
import QuestionModal from "../components/QuestionModal";
import { supabase } from "../supabaseClient"; // Import supabase client
import { storeScore } from "../services/scoreService";
import he from "he"; // Import he for decoding HTML entities
import "../index.css"; // Import the styles

const desiredCategories = [
  "General Knowledge",
  "Science & Nature",
  "Sports",
  "Entertainment: Books",
  "Entertainment: Film",
  "Entertainment: Music",
  "Geography",
  "History",
  "Art",
];

const Home = ({ user }) => {
  const [fetchError, setFetchError] = useState(null);
  const [highScores, setHighScores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60);
  const [preGameTimer, setPreGameTimer] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [preGameStarted, setPreGameStarted] = useState(false);

  useEffect(() => {
    // Fetch high scores from the database
    const fetchHighScores = async () => {
      const { data, error } = await supabase.from("highScore").select();

      if (error) {
        setFetchError("Could not fetch the high scores");
        setHighScores([]);
        console.log(error);
      } else {
        setHighScores(data);
        setFetchError(null);
      }
    };

    fetchHighScores();
  }, []);

  useEffect(() => {
    // Fetch categories from the external API
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://opentdb.com/api_category.php");
        const data = await response.json();
        // Filter categories based on the desired list
        const filteredCategories = data.trivia_categories.filter((category) =>
          desiredCategories.includes(category.name)
        );
        setCategories(filteredCategories);
      } catch (error) {
        setFetchError("Could not fetch categories");
        console.log(error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (preGameStarted && preGameTimer > 0) {
      const countdown = setInterval(() => {
        setPreGameTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else if (preGameStarted && preGameTimer === 0) {
      setPreGameStarted(false);
      setGameStarted(true);
    }
  }, [preGameStarted, preGameTimer]);

  useEffect(() => {
    // Main timer logic
    if (gameStarted && timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else if (gameStarted && timer === 0) {
      // Timer ran out, handle game over
      alert("Time's up! Your final score is " + score);
      handleGameOver();
      setGameStarted(false);
      setIsModalOpen(false);
    }
  }, [gameStarted, timer]);

  const handleSelectCategory = async (category) => {
    setSelectedCategory(category);
    await fetchQuestion(category);
  };

  const fetchQuestion = async (category) => {
    try {
      const response = await fetch(
        `https://opentdb.com/api.php?amount=1&category=${category.id}&type=multiple`
      );

      if (response.status === 429) {
        setFetchError("Too many requests. Please wait a moment and try again.");
        return;
      }

      const data = await response.json();

      if (data.results.length === 0) {
        setFetchError(
          "No questions available. Please try a different category."
        );
        return;
      }

      const question = data.results[0];
      setCurrentQuestion({
        text: he.decode(question.question), // Decode special characters
        options: [
          ...question.incorrect_answers.map((answer) => he.decode(answer)),
          he.decode(question.correct_answer),
        ].sort(() => Math.random() - 0.5),
      });
      setIsModalOpen(true);
    } catch (error) {
      setFetchError("Could not fetch the question");
      console.log(error);
    }
  };

  const handleCloseModal = async (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    if (user) {
      await storeScore(user.id, score + 1);
    } else {
      alert("Please log in to save your score.");
    }

    setIsModalOpen(false);
    setCurrentQuestion(null);
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleSkip = async () => {
    setIsModalOpen(false);
    setCurrentQuestion(null);
    await delay(2000); // Add a 2-second delay between requests
    await fetchQuestion(selectedCategory); // Fetch new question for the selected category
  };

  const handleStartGame = () => {
    setScore(0);
    setTimer(60);
    setPreGameTimer(3);
    setPreGameStarted(true);
  };

  const handleGameOver = async () => {
    // Check if the user's score is greater than the current high score
    const currentHighScore = highScores[0]; // Assuming the highest score is the first item in the array
    if (score > currentHighScore.score) {
      // Update the high score in the database
      const { error } = await supabase
        .from("highScore")
        .update({ score, userId: user.id, username: user.email }) // Ensure you store the username
        .eq("id", currentHighScore.id);

      if (error) {
        console.error("Error updating high score:", error);
      } else {
        // Refresh high scores
        const { data, error: fetchError } = await supabase
          .from("highScore")
          .select();
        if (!fetchError) {
          setHighScores(data);
        } else {
          console.error("Error fetching high scores:", fetchError);
        }
      }
    }
  };

  return (
    <div className="page home">
      {fetchError && <p>{fetchError}</p>}
      <div className="score-container">
        <h2>Your Score: {score}</h2>
        <h2>
          {gameStarted
            ? `Time Remaining: ${timer}s`
            : preGameStarted
            ? `Starting in: ${preGameTimer}`
            : ""}
        </h2>
      </div>
      <div
        className={`start-button-container ${
          gameStarted || preGameStarted ? "small" : ""
        }`}
      >
        {!gameStarted && !preGameStarted && (
          <button onClick={handleStartGame} className="start-game-button">
            Start Game
          </button>
        )}
      </div>
      {highScores.length > 0 && (
        <div className="highScore">
          <div className="highScore-container">
            {highScores.map((newHighScore) => (
              <HighScoreCard key={newHighScore.id} highScore={newHighScore} />
            ))}
          </div>
        </div>
      )}
      <Categories
        categories={categories}
        onSelectCategory={handleSelectCategory}
      />
      <QuestionModal
        question={currentQuestion}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSkip={handleSkip}
      />
    </div>
  );
};

export default Home;
