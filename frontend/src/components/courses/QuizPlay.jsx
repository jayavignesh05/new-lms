import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowLeft, FaChevronRight, FaChevronLeft } from "react-icons/fa6";
import Spinner from "../courses/Spinner";

const QuizPlay = ({ courseId, onBack }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  
  // NEW: State to track the current question number (0, 1, 2...)
  const [currentQIndex, setCurrentQIndex] = useState(0);

  const base_api = "https://9kz24kbm-7000.inc1.devtunnels.ms/api";

  useEffect(() => {
    axios.get(`${base_api}/courses/quiz-questions/${courseId}`)
      .then((res) => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [courseId]);

  const handleOptionChange = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  // NEW: Navigation Functions
  const handleNext = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex(currentQIndex - 1);
    }
  };

  const handleSubmit = () => {
    let newScore = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correct_option) {
        newScore++;
      }
    });
    setScore(newScore);
    setShowResult(true);
  };

  if (loading) return <Spinner fullPage={false} />;
  if (questions.length === 0) return <div className="p">No questions found.</div>;

  // Logic to get only the ONE current question
  const currentQuestion = questions[currentQIndex];
  const isLastQuestion = currentQIndex === questions.length - 1;

  return (
    <div className="quiz-container">
      {/* Header */}
      <div className="quiz-header">
        <button onClick={onBack} className="back-btn" >
          <FaArrowLeft /> Quit Quiz
        </button>
        
        {/* Progress Indicator */}
        {!showResult && (
          <span className="quiz-progress">
            Question {currentQIndex + 1} / {questions.length}
          </span>
        )}
      </div>

      {/* --- RESULT VIEW --- */}
      {showResult ? (
        <div className="quiz-result">
          <h3>Quiz Completed!</h3>
          <div className="score-display">
            You scored <span>{score}</span> out of <span>{questions.length}</span>
          </div>
          <button onClick={onBack} className="footer-button" style={{ marginTop: '20px' }}>
            Done
          </button>
        </div>
      ) : (
        /* --- SINGLE QUESTION VIEW --- */
        <div className="single-question-view">
          
          {/* Question Card */}
          <div className="question-card active-card">
            <p className="q-text">
              {currentQuestion.question_text}
            </p>

            <div className="options-group">
              {['a', 'b', 'c', 'd', 'e'].map((opt) => (
                <label
                  key={opt}
                  className={`option-label ${answers[currentQuestion.id] === opt ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name={`q-${currentQuestion.id}`}
                    value={opt}
                    onChange={() => handleOptionChange(currentQuestion.id, opt)}
                    checked={answers[currentQuestion.id] === opt}
                  />
                  <span className="opt-circle">{opt.toUpperCase()}</span>
                  <span className="opt-text">{currentQuestion[`option_${opt}`]}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Navigation Footer (Prev / Next / Submit) */}
          <div className="quiz-navigation">
            
            {/* Previous Button */}
            <button 
              className="nav-btn prev-btn" 
              onClick={handlePrev} 
              disabled={currentQIndex === 0}
            >
              <FaChevronLeft /> Previous
            </button>

            {/* Next or Submit Button */}
            {isLastQuestion ? (
              <button className="nav-btn submit-btn" onClick={handleSubmit}>
                Submit Quiz
              </button>
            ) : (
              <button className="nav-btn next-btn" onClick={handleNext}>
                Next <FaChevronRight />
              </button>
            )}
            
          </div>

        </div>
      )}
    </div>
  );
};

export default QuizPlay;