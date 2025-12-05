/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../../../store";
import { setQuizzes } from "../../reducer";
import * as client from "../../../../client";
import { Button, Form, Card, Alert, Modal } from "react-bootstrap";
import { FaCheck, FaTimes, FaClock } from "react-icons/fa";

export default function TakeQuiz() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);

  const [quiz, setQuiz] = useState<any>(null);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [showResults, setShowResults] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const [latestAttempt, setLatestAttempt] = useState<any>(null);
  const [currentAttempt, setCurrentAttempt] = useState<any>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [attemptData, setAttemptData] = useState<any>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchQuizzes = async () => {
    if (cid) {
      const fetchedQuizzes = await client.findQuizzesForCourse(cid as string);
      dispatch(setQuizzes(fetchedQuizzes));
    }
  };

  const fetchAttemptData = async () => {
    try {
      // Get completed attempt count
      const countData = await client.getQuizAttemptCount(qid as string);
      setAttemptCount(countData.count);

      // Get latest completed attempt
      const latest = await client.getLatestQuizAttempt(qid as string);
      setLatestAttempt(latest);

      // Check for in-progress attempt
      const inProgress = await client.getInProgressAttempt(qid as string);
      setCurrentAttempt(inProgress);

      return inProgress;
    } catch (error) {
      console.error("Error fetching attempt data:", error);
      return null;
    }
  };

  const initializeQuiz = async () => {
    setIsLoading(true);
    await fetchQuizzes();
    const inProgressAttempt = await fetchAttemptData();
    
    if (inProgressAttempt) {
      // Resume existing attempt
      console.log("Resuming in-progress attempt", inProgressAttempt);
      const savedAnswers: { [key: string]: any } = {};
      inProgressAttempt.answers?.forEach((ans: any) => {
        savedAnswers[ans.question] = ans.answer;
      });
      setAnswers(savedAnswers);

      // Calculate time remaining based on elapsed time
      const startTime = new Date(inProgressAttempt.startedAt);
      const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);
      const timeLimitSeconds = (quiz?.timeLimit || 20) * 60;
      const remaining = Math.max(0, timeLimitSeconds - elapsed);
      setTimeRemaining(remaining);
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    initializeQuiz();
  }, [cid, qid]);

  useEffect(() => {
    const foundQuiz = quizzes.find((q: any) => q._id === qid);
    if (foundQuiz) {
      setQuiz(foundQuiz);
      
      // Only set initial time if no in-progress attempt
      if (!currentAttempt) {
        const timeLimitMinutes = foundQuiz.timeLimit || 20;
        setTimeRemaining(timeLimitMinutes * 60);
      }
    }
  }, [quizzes, qid]);

  // Auto-save answers to database
  useEffect(() => {
    if (!currentAttempt || showResults) return;

    // Debounce saves - wait 2 seconds after last change
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const answersArray = Object.entries(answers).map(([questionId, answer]) => ({
          question: questionId,
          answer,
          correct: false, // Will be calculated on submit
          points: 0,
        }));
        
        await client.updateQuizAttemptAnswers(currentAttempt._id, answersArray);
        console.log("Answers auto-saved to database");
      } catch (error) {
        console.error("Error auto-saving answers:", error);
      }
    }, 2000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [answers, currentAttempt, showResults]);

  // Timer countdown
  useEffect(() => {
    if (!quiz || showResults || isLoading || !currentAttempt) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [quiz, showResults, isLoading, currentAttempt]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoading || !quiz) {
    return <div>Loading...</div>;
  }

  const questions = quiz.questions || [];
  const oneQuestionAtATime = quiz.oneQuestionAtATime !== false;
  
  const canTakeQuiz = quiz.multipleAttempts 
    ? attemptCount < quiz.attemptsAllowed 
    : attemptCount === 0;
  
  const attemptsRemaining = quiz.multipleAttempts
    ? Math.max(0, quiz.attemptsAllowed - attemptCount)
    : attemptCount === 0 ? 1 : 0;

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
    const answersWithScores = questions.map((question: any) => {
      const isCorrect = checkAnswer(question, answers[question._id]);
      return {
        question: question._id,
        answer: answers[question._id],
        correct: isCorrect,
        points: isCorrect ? question.points || 0 : 0,
      };
    });

    const totalScore = answersWithScores.reduce((sum, a) => sum + a.points, 0);
    return { score: totalScore, answersWithScores };
  };

  const handleStartQuiz = async () => {
    try {
      const newAttempt = await client.startQuizAttempt(qid as string);
      setCurrentAttempt(newAttempt);
      console.log("Started new quiz attempt", newAttempt);
    } catch (error) {
      console.error("Error starting quiz:", error);
      alert("Failed to start quiz. Please try again.");
    }
  };

  const handleSubmit = async (autoSubmit: boolean = false) => {
    if (!currentAttempt) return;

    // Clear timers
    if (timerRef.current) clearInterval(timerRef.current);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    const { score: finalScore, answersWithScores } = calculateScore();
    setScore(finalScore);

    try {
      const submittedAttempt = await client.submitQuizAttempt(currentAttempt._id, {
        answers: answersWithScores,
        score: finalScore,
        totalPoints: quiz.points || 0,
      });
      
      setAttemptData(submittedAttempt);
      setShowResults(true);
      setShowSubmitModal(false);
      
      if (autoSubmit) {
        alert("Time's up! Your quiz has been automatically submitted.");
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Failed to submit quiz. Please try again.");
    }
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

  const renderQuestion = (question: any, index: number, isViewingResults: boolean = false) => {
    const isCorrect = isViewingResults ? checkAnswer(question, answers[question._id]) : null;
    const showCorrectAnswers = quiz.showCorrectAnswers === "Immediately";

    return (
      <Card className="mb-4" key={question._id}>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <h5>
              Question {index + 1}
              {isViewingResults && (
                <span className={`ms-2 ${isCorrect ? "text-success" : "text-danger"}`}>
                  {isCorrect ? <FaCheck /> : <FaTimes />}
                </span>
              )}
            </h5>
            <span className="badge bg-secondary">{question.points || 1} pts</span>
          </div>

          {question.title && <div className="fw-bold mb-2">{question.title}</div>}
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
                    disabled={isViewingResults}
                    className={`mb-2 ${
                      isViewingResults && showCorrectAnswers
                        ? isCorrectChoice ? "text-success fw-bold" : isSelected ? "text-danger" : ""
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
                disabled={isViewingResults}
                className={`mb-2 ${
                  isViewingResults && showCorrectAnswers
                    ? question.correctAnswer === true ? "text-success fw-bold" : answers[question._id] === true ? "text-danger" : ""
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
                disabled={isViewingResults}
                className={`mb-2 ${
                  isViewingResults && showCorrectAnswers
                    ? question.correctAnswer === false ? "text-success fw-bold" : answers[question._id] === false ? "text-danger" : ""
                    : ""
                }`}
              />
            </div>
          )}

          {question.type === "FILL_BLANK" && (
            <div>
              <Form.Control
                type="text"
                value={answers[question._id] || ""}
                onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                disabled={isViewingResults}
                placeholder="Type your answer here..."
                className={
                  isViewingResults && showCorrectAnswers
                    ? isCorrect ? "border-success" : "border-danger"
                    : ""
                }
              />
              {isViewingResults && showCorrectAnswers && (
                <div className="mt-2 small text-muted">
                  <strong>Possible correct answers:</strong> {question.possibleAnswers?.join(", ")}
                </div>
              )}
            </div>
          )}
        </Card.Body>
      </Card>
    );
  };

  // Check availability
  const now = new Date();
  const availableDate = quiz["Available Date"] ? new Date(quiz["Available Date"]) : null;
  const availableUntilDate = quiz["Available Until Date"] ? new Date(quiz["Available Until Date"]) : null;

  if (availableDate && now < availableDate) {
    return (
      <Alert variant="warning">
        This quiz is not available yet. It will be available on {availableDate.toLocaleString()}.
      </Alert>
    );
  }

  if (availableUntilDate && now > availableUntilDate) {
    return <Alert variant="danger">This quiz is no longer available.</Alert>;
  }

  // Check if student has attempts remaining
  if (!canTakeQuiz && !currentAttempt) {
    return (
      <Alert variant="warning">
        <h4>No Attempts Remaining</h4>
        <p>You have used all {quiz.attemptsAllowed} attempts for this quiz.</p>
        {latestAttempt && (
          <p>Your last score: {latestAttempt.score} / {latestAttempt.totalPoints}</p>
        )}
        <Button variant="primary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}>
          Back to Quiz Details
        </Button>
      </Alert>
    );
  }

  // If no current attempt exists, need to start one
  if (!currentAttempt && !showResults) {
    return (
      <div style={{ maxWidth: "600px", margin: "50px auto" }}>
        <Card>
          <Card.Body>
            <h3>{quiz.title}</h3>
            <p className="text-muted">Attempt {attemptCount + 1} {quiz.multipleAttempts && `of ${quiz.attemptsAllowed}`}</p>
            
            {quiz.description && (
              <>
                <h5 className="mt-4">Quiz Instructions</h5>
                <p>{quiz.description}</p>
              </>
            )}

            <div className="mt-4">
              <div><strong>Total Points:</strong> {quiz.points || 0}</div>
              <div><strong>Questions:</strong> {questions.length}</div>
              <div><strong>Time Limit:</strong> {quiz.timeLimit || 20} Minutes</div>
              <div><strong>Attempts Remaining:</strong> {attemptsRemaining}</div>
            </div>

            <div className="d-flex gap-2 mt-4">
              <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}>
                Cancel
              </Button>
              <Button variant="success" onClick={handleStartQuiz}>
                Start Quiz
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className="wd-take-quiz" style={{ maxWidth: "900px", margin: "0 auto" }}>
      {/* Header with Timer */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>{quiz.title}</h2>
          <div className="text-muted">
            Attempt {currentAttempt?.attemptNumber || attemptCount + 1}
            {quiz.multipleAttempts && ` of ${quiz.attemptsAllowed}`}
          </div>
        </div>
        {!showResults && currentAttempt && (
          <div className="d-flex gap-3 align-items-center">
            <Alert 
              variant={timeRemaining < 60 ? "danger" : timeRemaining < 300 ? "warning" : "info"} 
              className="mb-0 d-flex align-items-center gap-2 py-2"
            >
              <FaClock />
              <strong>Time Remaining: {formatTime(timeRemaining)}</strong>
            </Alert>
          </div>
        )}
      </div>

      {/* Auto-save indicator */}
      {!showResults && currentAttempt && Object.keys(answers).length > 0 && (
        <Alert variant="success" className="py-2 mb-3">
          <small>✓ Your answers are being saved automatically to the database</small>
        </Alert>
      )}

      {/* Results Summary */}
      {showResults && (
        <Alert variant={score >= (quiz.points || 0) * 0.7 ? "success" : "warning"} className="mb-4">
          <h4>Quiz Results</h4>
          <div className="fs-3">
            <strong>Score: {score} / {quiz.points || 0}</strong>
            <span className="ms-3">({((score / (quiz.points || 1)) * 100).toFixed(1)}%)</span>
          </div>
          {attemptData && (
            <div className="mt-2">Submitted: {new Date(attemptData.submittedAt).toLocaleString()}</div>
          )}
        </Alert>
      )}

      {/* Questions */}
      {questions.length === 0 ? (
        <Alert variant="warning">This quiz has no questions yet.</Alert>
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
              <Button variant="primary" onClick={handleNextQuestion}>Next</Button>
            ) : (
              <Button variant="success" onClick={() => setShowSubmitModal(true)}>Submit Quiz</Button>
            )}
          </div>
        </>
      ) : (
        <>
          {questions.map((question: any, index: number) =>
            renderQuestion(question, index, showResults)
          )}
          {!showResults && (
            <div className="d-flex justify-content-end mt-4">
              <Button variant="success" size="lg" onClick={() => setShowSubmitModal(true)}>
                Submit Quiz
              </Button>
            </div>
          )}
        </>
      )}

      {showResults && (
        <div className="d-flex justify-content-end mt-4 border-top pt-4">
          <Button variant="primary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}>
            Back to Quiz Details
          </Button>
        </div>
      )}

      {/* Submit Modal */}
      <Modal show={showSubmitModal} onHide={() => setShowSubmitModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Submit Quiz?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to submit this quiz?</p>
          <p className="text-muted">You will not be able to change your answers after submission.</p>
          <p><strong>Attempts remaining after this:</strong> {attemptsRemaining - 1}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSubmitModal(false)}>Cancel</Button>
          <Button variant="success" onClick={() => handleSubmit(false)}>Submit Quiz</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
