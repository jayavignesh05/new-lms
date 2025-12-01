import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowLeft, FaCircleCheck, FaChevronRight, FaChevronLeft } from "react-icons/fa6";
import Spinner from "../courses/Spinner";


const FeedbackPlay = ({ courseId, onBack }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // NEW: State to track current question index
  const [currentQIndex, setCurrentQIndex] = useState(0);

  const base_api = "https://9kz24kbm-7000.inc1.devtunnels.ms/api";

  useEffect(() => {
    axios.get(`${base_api}/courses/feedback-questions/${courseId}`)
      .then((res) => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [courseId]);

  const handleOptionChange = (questionId, optionText) => {
    setAnswers({ ...answers, [questionId]: optionText });
  };

  // Navigation Functions
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
    console.log("Feedback Data:", answers);
    // Inga backend API call panni save pannalam
    setSubmitted(true);
  };

  if (loading) return <Spinner fullPage={false} />;
  if (questions.length === 0) return <div className="p-4">No feedback questions found.</div>;

  // Get Current Question Data
  const currentQuestion = questions[currentQIndex];
  const isLastQuestion = currentQIndex === questions.length - 1;

  return (
    <div className="quiz-container">

      {/* --- Header --- */}
      <div className="quiz-header">
        <button onClick={onBack} className="back-btn" >
          <FaArrowLeft /> Cancel
        </button>

        {!submitted && (
          <span className="quiz-progress">
            Question {currentQIndex + 1} / {questions.length}
          </span>
        )}
      </div>

      {/* --- RESULT VIEW (Thank You) --- */}
      {submitted ? (
        <div className="quiz-result">
          <FaCircleCheck size={50} color="#22c55e" style={{ marginBottom: '20px' }} />
          <h3>Thank You!</h3>
          <p style={{ color: '#64748b', marginBottom: '20px' }}>
            Your feedback helps us improve the course quality.
          </p>
          <button onClick={onBack} className="footer-button">
            Back to Course
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
                  className={`option-label ${answers[currentQuestion.id] === currentQuestion[`option_${opt}`] ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name={`f-${currentQuestion.id}`}
                    value={opt}
                    // Store actual text (e.g., "Very Good") instead of 'a'
                    onChange={() => handleOptionChange(currentQuestion.id, currentQuestion[`option_${opt}`])}
                    checked={answers[currentQuestion.id] === currentQuestion[`option_${opt}`]}
                  />
                  <span className="opt-circle">{opt.toUpperCase()}</span>
                  <span className="opt-text">{currentQuestion[`option_${opt}`]}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Navigation Footer */}
          <div className="quiz-navigation">

            <button
              className="nav-btn prev-btn"
              onClick={handlePrev}
              disabled={currentQIndex === 0}
            >
              <FaChevronLeft /> Previous
            </button>

            {isLastQuestion ? (
              <button className="nav-btn submit-btn" onClick={handleSubmit}>
                Submit Feedback
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

export default FeedbackPlay;