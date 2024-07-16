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

  return (
    <div className="page home">
      {fetchError && <p>{fetchError}</p>}
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
