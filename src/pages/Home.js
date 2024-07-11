import { useEffect, useState } from "react";
import HighScoreCard from "../components/HighScoreCard";
import Categories from "../components/Categories";
import QuestionModal from "../components/QuestionModal";
import supabase from "../config/supabaseClient"; // Import supabase client
import "../index.css"; // Import the styles

const Home = () => {
  const [fetchError, setFetchError] = useState(null);
  const [highScores, setHighScores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        setCategories(data.trivia_categories);
      } catch (error) {
        setFetchError("Could not fetch categories");
        console.log(error);
      }
    };

    fetchCategories();
  }, []);

  const handleSelectCategory = async (category) => {
    setSelectedCategory(category);
    // Fetch question for the selected category from the external API
    try {
      const response = await fetch(
        `https://opentdb.com/api.php?amount=1&category=${category.id}&type=multiple`
      );
      const data = await response.json();
      const question = data.results[0];
      setCurrentQuestion({
        text: question.question,
        options: [...question.incorrect_answers, question.correct_answer].sort(
          () => Math.random() - 0.5
        ),
      });
      setIsModalOpen(true);
    } catch (error) {
      setFetchError("Could not fetch the question");
      console.log(error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="page home">
      {fetchError && <p>{fetchError}</p>}
      {highScores.length > 0 && (
        <div className="highScore">
          <h2>High Score</h2>
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
      />
    </div>
  );
};

export default Home;
