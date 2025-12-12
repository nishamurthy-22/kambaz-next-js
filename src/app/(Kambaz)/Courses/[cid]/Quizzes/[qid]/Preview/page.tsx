/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../../store";
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

  const fetchQuizzes = useCallback(async () => {
    if (cid) {
      const fetchedQuizzes = await client.findQuizzesForCourse(cid as string);
      dispatch(setQuizzes(fetchedQuizzes));
    }
  }, [cid, dispatch]);

  useEffect(() => {
    fetchQuizzes();
  }, [cid, fetchQuizzes]);

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

  const checkFillBlankAnswer = (question: any, userAnswers: any) => {
      if (!question.blanks || question.blanks.length === 0) {
      if (!userAnswers) return { correct: false, points: 0 };
      const userAnswer = question.caseSensitive ? userAnswers : userAnswers.toLowerCase();
      const isCorrect = question.possibleAnswers?.some((possibleAnswer: string) => {
        const checkAnswer = question.caseSensitive ? possibleAnswer : possibleAnswer.toLowerCase();
        return userAnswer.trim() === checkAnswer.trim();
      });
      return { correct: isCorrect, points: isCorrect ? (question.points || 0) : 0 };
    }

    const answersArray = Array.isArray(userAnswers) ? userAnswers : [];
    let totalPoints = 0;
    let allCorrect = true;

    question.blanks.forEach((blank: any, index: number) => {
      const userAnswer = answersArray[index] || "";
      if (!userAnswer) {
        allCorrect = false;
        return;
      }

      const answerToCheck = blank.caseSensitive ? userAnswer : userAnswer.toLowerCase();
      const isCorrect = blank.possibleAnswers?.some((possibleAnswer: string) => {
        const checkAnswer = blank.caseSensitive ? possibleAnswer : possibleAnswer.toLowerCase();
        return answerToCheck.trim() === checkAnswer.trim();
      });

      if (isCorrect) {
        totalPoints += blank.points || 0;
      } else {
        allCorrect = false;
      }
    });

    return { correct: allCorrect, points: totalPoints };
  };

  const checkAnswer = (question: any, answer: any): boolean => {
    if (question.type === "MULTIPLE_CHOICE") {
      return answer === question.correctChoice;
    } else if (question.type === "TRUE_FALSE") {
      return answer === question.correctAnswer;
    } else if (question.type === "FILL_BLANK") {
      return checkFillBlankAnswer(question, answer).correct;
    }
    return false;
  };

  const calculateScore = () => {
    let totalScore = 0;
    questions.forEach((question: any) => {
      if (question.type === "FILL_BLANK") {
        const result = checkFillBlankAnswer(question, answers[question._id]);
        totalScore += result.points;
      } else if (checkAnswer(question, answers[question._id])) {
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
    let fillBlankResult = null;
    if (question.type === "FILL_BLANK" && showResults) {
      fillBlankResult = checkFillBlankAnswer(question, answers[question._id]);
    }
    
    const isCorrect = showResults 
      ? (question.type === "FILL_BLANK" ? fillBlankResult?.correct : checkAnswer(question, answers[question._id]))
      : null;

    return (
      <Card className="mb-4" key={question._id}>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <h5>
              Question {index + 1}
              {showResults && (
                <span className={`ms-2 ${isCorrect ? "text-success" : fillBlankResult && fillBlankResult.points > 0 ? "text-warning" : "text-danger"}`}>
                  {isCorrect ? <FaCheck /> : fillBlankResult && fillBlankResult.points > 0 ? "◐" : <FaTimes />}
                </span>
              )}
            </h5>
            <span className="badge bg-secondary">{question.points || 1} pts</span>
          </div>

          {question.title && (
            <div className="fw-bold mb-2">{question.title}</div>
          )}

          <div className="mb-3">{question.question}</div>

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

          {question.type === "FILL_BLANK" && (
            <div>
              {(!question.blanks || question.blanks.length === 0) ? (
                <>
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
                </>
              ) : (
                <>
                  {question.blanks.map((blank: any, blankIndex: number) => {
                    const userAnswersArray = Array.isArray(answers[question._id]) 
                      ? answers[question._id] 
                      : [];
                    
                    let blankIsCorrect = false;
                    if (showResults) {
                      const userAnswer = userAnswersArray[blankIndex] || "";
                      if (userAnswer) {
                        const answerToCheck = blank.caseSensitive ? userAnswer : userAnswer.toLowerCase();
                        blankIsCorrect = blank.possibleAnswers?.some((possibleAnswer: string) => {
                          const checkAnswer = blank.caseSensitive ? possibleAnswer : possibleAnswer.toLowerCase();
                          return answerToCheck.trim() === checkAnswer.trim();
                        });
                      }
                    }
                    
                    return (
                      <div key={blankIndex} className="mb-3">
                        <Form.Label>
                          Blank {blankIndex + 1} 
                          <span className="text-muted ms-2">({blank.points || 0} pts)</span>
                          {showResults && (
                            <span className={`ms-2 ${blankIsCorrect ? "text-success" : "text-danger"}`}>
                              {blankIsCorrect ? <FaCheck /> : <FaTimes />}
                            </span>
                          )}
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={userAnswersArray[blankIndex] || ""}
                          onChange={(e) => {
                            const newAnswers = [...userAnswersArray];
                            newAnswers[blankIndex] = e.target.value;
                            handleAnswerChange(question._id, newAnswers);
                          }}
                          disabled={showResults}
                          placeholder={`Answer for blank ${blankIndex + 1}`}
                          className={
                            showResults
                              ? blankIsCorrect ? "border-success" : "border-danger"
                              : ""
                          }
                        />
                        {showResults && (
                          <Form.Text className="text-muted d-block mt-1">
                            <strong>Possible answers:</strong> {blank.possibleAnswers?.join(", ")}
                          </Form.Text>
                        )}
                      </div>
                    );
                  })}
                  {showResults && (
                    <Alert variant={fillBlankResult?.points === question.points ? "success" : fillBlankResult?.points > 0 ? "warning" : "danger"} className="py-2 mt-2">
                      <small>
                        <strong>Your Score:</strong> {fillBlankResult?.points || 0} / {question.points} pts
                        {fillBlankResult && fillBlankResult.points > 0 && fillBlankResult.points < question.points && (
                          <span className="ms-2">(Partial Credit)</span>
                        )}
                      </small>
                    </Alert>
                  )}
                </>
              )}
            </div>
          )}
        </Card.Body>
      </Card>
    );
  };

  return (
    <div className="wd-quiz-preview" style={{ maxWidth: "900px", margin: "0 auto" }}>
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

      <Alert variant="info" className="mb-4">
        <div className="d-flex justify-content-between">
          <div>
            <strong>Total Points:</strong> {quiz.points || 0}
          </div>
          <div>
            <strong>Questions:</strong> {questions.length}
          </div>
          <div>
            <strong>Time Limit:</strong>{" "}
            {quiz.hasTimeLimit === false ? "No Time Limit" : `${quiz.timeLimit || 20} Minutes`}
          </div>
        </div>
      </Alert>

      {quiz.description && (
        <Card className="mb-4">
          <Card.Body>
            <h5>Quiz Instructions</h5>
            <p>{quiz.description}</p>
          </Card.Body>
        </Card>
      )}

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

      {questions.length === 0 ? (
        <Alert variant="warning">
          This quiz has no questions yet. Click &quot;Edit Quiz&quot; to add questions.
        </Alert>
      ) : oneQuestionAtATime && !showResults ? (
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
