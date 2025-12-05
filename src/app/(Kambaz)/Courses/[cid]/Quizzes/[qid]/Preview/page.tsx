/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../../../store";
import { setQuizzes } from "../../reducer";
import * as client from "../../../../client";
import { Button, Form, Card, Alert } from "react-bootstrap";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function QuizPreview() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);

  const [quiz, setQuiz] = useState<any>(null);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [showResults, setShowResults] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);

  const fetchQuizzes = async () => {
    if (cid) {
      const fetchedQuizzes = await client.findQuizzesForCourse(cid as string);
      dispatch(setQuizzes(fetchedQuizzes));
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [cid]);

  useEffect(() => {
    const foundQuiz = quizzes.find((q: any) => q._id === qid);
    if (foundQuiz) {
      setQuiz(foundQuiz);
    }
  }, [quizzes, qid]);

  if (!quiz) {
    return <div>Loading...</div>;
  }

  const questions = quiz.questions || [];
  const oneQuestionAtATime = quiz.oneQuestionAtATime !== false;

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const checkAnswer = (question: any, answer: any): boolean => {
    if (question.type === "MULTIPLE_CHOICE") {
      return answer === question.correctChoice;
    } else if (question.type === "TRUE_FALSE") {
      return answer === question.correctAnswer;
    } else if (question.type === "FILL_BLANK") {
      if (!answer) return false;
      const userAnswer = question.caseSensitive ? answer : answer.toLowerCase();
      return question.possibleAnswers.some((possibleAnswer: string) => {
        const checkAnswer = question.caseSensitive ? possibleAnswer : possibleAnswer.toLowerCase();
        return userAnswer === checkAnswer;
      });
    }
    return false;
  };

  const calculateScore = () => {
    let totalScore = 0;
    questions.forEach((question: any) => {
      if (checkAnswer(question, answers[question._id])) {
        totalScore += question.points || 0;
      }
    });
    return totalScore;
  };

  const handleSubmit = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setShowResults(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const renderQuestion = (question: any, index: number) => {
    const isCorrect = showResults ? checkAnswer(question, answers[question._id]) : null;

    return (
      <Card className="mb-4" key={question._id}>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <h5>
              Question {index + 1}
              {showResults && (
                <span className={`ms-2 ${isCorrect ? "text-success" : "text-danger"}`}>
                  {isCorrect ? <FaCheck /> : <FaTimes />}
                </span>
              )}
            </h5>
            <span className="badge bg-secondary">{question.points || 1} pts</span>
          </div>

          {question.title && (
            <div className="fw-bold mb-2">{question.title}</div>
          )}

          <div className="mb-3">{question.question}</div>

          {/* Multiple Choice */}
          {question.type === "MULTIPLE_CHOICE" && (
            <div>
              {question.choices?.map((choice: string, choiceIndex: number) => {
                const isSelected = answers[question._id] === choiceIndex;
                const isCorrectChoice = choiceIndex === question.correctChoice;
                
                return (
                  <Form.Check
                    key={choiceIndex}
                    type="radio"
                    name={`question-${question._id}`}
                    id={`question-${question._id}-choice-${choiceIndex}`}
                    label={choice}
                    checked={isSelected}
                    onChange={() => handleAnswerChange(question._id, choiceIndex)}
                    disabled={showResults}
                    className={`mb-2 ${
                      showResults
                        ? isCorrectChoice
                          ? "text-success fw-bold"
                          : isSelected
                          ? "text-danger"
                          : ""
                        : ""
                    }`}
                  />
                );
              })}
            </div>
          )}

          {/* True/False */}
          {question.type === "TRUE_FALSE" && (
            <div>
              <Form.Check
                type="radio"
                name={`question-${question._id}`}
                id={`question-${question._id}-true`}
                label="True"
                checked={answers[question._id] === true}
                onChange={() => handleAnswerChange(question._id, true)}
                disabled={showResults}
                className={`mb-2 ${
                  showResults
                    ? question.correctAnswer === true
                      ? "text-success fw-bold"
                      : answers[question._id] === true
                      ? "text-danger"
                      : ""
                    : ""
                }`}
              />
              <Form.Check
                type="radio"
                name={`question-${question._id}`}
                id={`question-${question._id}-false`}
                label="False"
                checked={answers[question._id] === false}
                onChange={() => handleAnswerChange(question._id, false)}
                disabled={showResults}
                className={`mb-2 ${
                  showResults
                    ? question.correctAnswer === false
                      ? "text-success fw-bold"
                      : answers[question._id] === false
                      ? "text-danger"
                      : ""
                    : ""
                }`}
              />
            </div>
          )}

          {/* Fill in the Blank */}
          {question.type === "FILL_BLANK" && (
            <div>
              <Form.Control
                type="text"
                value={answers[question._id] || ""}
                onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                disabled={showResults}
                placeholder="Type your answer here..."
                className={
                  showResults
                    ? isCorrect
                      ? "border-success"
                      : "border-danger"
                    : ""
                }
              />
              {showResults && (
                <div className="mt-2 small text-muted">
                  <strong>Possible correct answers:</strong>{" "}
                  {question.possibleAnswers?.join(", ")}
                </div>
              )}
            </div>
          )}
        </Card.Body>
      </Card>
    );
  };

  return (
    <div className="wd-quiz-preview" style={{ maxWidth: "900px", margin: "0 auto" }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>{quiz.title}</h2>
          <div className="text-muted">
            This is a preview - Faculty answers are not saved
          </div>
        </div>
        <Button
          variant="secondary"
          onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Edit`)}
        >
          Edit Quiz
        </Button>
      </div>

      {/* Quiz Info */}
      <Alert variant="info" className="mb-4">
        <div className="d-flex justify-content-between">
          <div>
            <strong>Total Points:</strong> {quiz.points || 0}
          </div>
          <div>
            <strong>Questions:</strong> {questions.length}
          </div>
          <div>
            <strong>Time Limit:</strong> {quiz.timeLimit || 20} Minutes
          </div>
        </div>
      </Alert>

      {/* Quiz Instructions */}
      {quiz.description && (
        <Card className="mb-4">
          <Card.Body>
            <h5>Quiz Instructions</h5>
            <p>{quiz.description}</p>
          </Card.Body>
        </Card>
      )}

      {/* Results Summary */}
      {showResults && (
        <Alert variant={score >= (quiz.points || 0) * 0.7 ? "success" : "warning"} className="mb-4">
          <h4>Quiz Results</h4>
          <div className="fs-3">
            <strong>Score: {score} / {quiz.points || 0}</strong>
            <span className="ms-3">
              ({((score / (quiz.points || 1)) * 100).toFixed(1)}%)
            </span>
          </div>
        </Alert>
      )}

      {/* Questions */}
      {questions.length === 0 ? (
        <Alert variant="warning">
          This quiz has no questions yet. Click "Edit Quiz" to add questions.
        </Alert>
      ) : oneQuestionAtATime && !showResults ? (
        // One question at a time mode
        <>
          {renderQuestion(questions[currentQuestionIndex], currentQuestionIndex)}
          
          <div className="d-flex justify-content-between align-items-center mt-4">
            <Button
              variant="secondary"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            
            <span className="text-muted">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            
            {currentQuestionIndex < questions.length - 1 ? (
              <Button variant="primary" onClick={handleNextQuestion}>
                Next
              </Button>
            ) : (
              <Button variant="success" onClick={handleSubmit}>
                Submit Quiz
              </Button>
            )}
          </div>
        </>
      ) : (
        // All questions at once mode or results view
        <>
          {questions.map((question: any, index: number) =>
            renderQuestion(question, index)
          )}
          
          {!showResults && (
            <div className="d-flex justify-content-end mt-4">
              <Button variant="success" size="lg" onClick={handleSubmit}>
                Submit Quiz
              </Button>
            </div>
          )}
        </>
      )}

      {/* Back to Quiz Button (after submission) */}
      {showResults && (
        <div className="d-flex justify-content-between mt-4 border-top pt-4">
          <Button
            variant="secondary"
            onClick={() => {
              setAnswers({});
              setShowResults(false);
              setCurrentQuestionIndex(0);
              setScore(0);
            }}
          >
            Retake Preview
          </Button>
          <Button
            variant="primary"
            onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}
          >
            Back to Quiz Details
          </Button>
        </div>
      )}
    </div>
  );
}
