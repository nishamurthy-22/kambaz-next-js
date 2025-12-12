/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../../store";
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
  const [attemptCount, setAttemptCount] = useState(0);
  const [latestAttempt, setLatestAttempt] = useState<any>(null);
  const [currentAttempt, setCurrentAttempt] = useState<any>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submittedAttempt, setSubmittedAttempt] = useState<any>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [shuffledChoices, setShuffledChoices] = useState<{ [key: string]: string[] }>({});
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchQuizzes = useCallback(async () => {
    if (cid) {
      const fetchedQuizzes = await client.findQuizzesForCourse(cid as string);
      dispatch(setQuizzes(fetchedQuizzes));
    }
  }, [cid, dispatch]);

  const fetchAttemptData = useCallback(async () => {
    try {
      const countData = await client.getQuizAttemptCount(qid as string);
      setAttemptCount(countData.count);

      const latest = await client.getLatestQuizAttempt(qid as string);
      setLatestAttempt(latest);

      const inProgress = await client.getInProgressAttempt(qid as string);
      setCurrentAttempt(inProgress);

      return inProgress;
    } catch (error) {
      return null;
    }
  }, [qid]);

  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const initializeQuiz = useCallback(async () => {
    setIsLoading(true);
    await fetchQuizzes();
    const inProgressAttempt = await fetchAttemptData();
    
    if (inProgressAttempt) {
      const savedAnswers: { [key: string]: any } = {};
      inProgressAttempt.answers?.forEach((ans: any) => {
        savedAnswers[ans.question] = ans.answer;
      });
      setAnswers(savedAnswers);
    }
    
    setIsLoading(false);
  }, [fetchQuizzes, fetchAttemptData]);

  useEffect(() => {
    initializeQuiz();
  }, [initializeQuiz]);

  useEffect(() => {
    const foundQuiz: any = quizzes.find((q: any) => q._id === qid);
    if (foundQuiz) {
      setQuiz(foundQuiz);
      
      if (foundQuiz.shuffleAnswers && foundQuiz.questions) {
        const shuffled: { [key: string]: string[] } = {};
        foundQuiz.questions.forEach((q: any) => {
          if (q.type === "MULTIPLE_CHOICE" && q.choices) {
            shuffled[q._id] = shuffleArray(q.choices);
          }
        });
        setShuffledChoices(shuffled);
      }
      
      if (!currentAttempt && foundQuiz.hasTimeLimit !== false) {
        const timeLimitMinutes = foundQuiz.timeLimit;
        setTimeRemaining(timeLimitMinutes * 60);
      }
      
      if (currentAttempt && foundQuiz.hasTimeLimit !== false) {
        const startTime = new Date(currentAttempt.startedAt);
        const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);
        const timeLimitSeconds = foundQuiz.timeLimit * 60;
        const remaining = Math.max(0, timeLimitSeconds - elapsed);
        setTimeRemaining(remaining);
      }
    }
  }, [quizzes, qid, currentAttempt]);

  useEffect(() => {
    if (!currentAttempt || showResults) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const answersArray = Object.entries(answers).map(([questionId, answer]) => ({
          question: questionId,
          answer,
        }));
        
        await client.updateQuizAttemptAnswers(currentAttempt._id, answersArray);
      } catch (error) {
      }
    }, 2000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [answers, currentAttempt, showResults]);

  useEffect(() => {
    if (!quiz || showResults || isLoading || !currentAttempt) return;
    if (quiz.hasTimeLimit === false) return;

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

  const handleStartQuiz = async () => {
    try {
      const newAttempt = await client.startQuizAttempt(qid as string);
      setCurrentAttempt(newAttempt);
    } catch (error) {
      alert("Failed to start quiz. Please try again.");
    }
  };

  const handleSubmit = async (autoSubmit: boolean = false) => {
    if (!currentAttempt) return;

    if (timerRef.current) clearInterval(timerRef.current);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    try {
      const answersArray = Object.entries(answers).map(([questionId, answer]) => ({
        question: questionId,
        answer,
      }));

      const gradedAttempt = await client.submitQuizAttempt(currentAttempt._id, {
        answers: answersArray,
      });
      
      setSubmittedAttempt(gradedAttempt);
      setShowResults(true);
      setShowSubmitModal(false);
      
      if (autoSubmit) {
        alert("Time's up! Your quiz has been automatically submitted.");
      }
    } catch (error) {
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
    let gradedAnswer = null;
    if (isViewingResults && submittedAttempt) {
      gradedAnswer = submittedAttempt.answers?.find((a: any) => a.question === question._id);
    }

    const displayChoices = quiz.shuffleAnswers && shuffledChoices[question._id]
      ? shuffledChoices[question._id]
      : question.choices;

    return (
      <Card className="mb-4" key={question._id}>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <h5>
              Question {index + 1}
              {isViewingResults && gradedAnswer && (
                <span className={`ms-2 ${gradedAnswer.correct ? "text-success" : gradedAnswer.points > 0 ? "text-warning" : "text-danger"}`}>
                  {gradedAnswer.correct ? <FaCheck /> : gradedAnswer.points > 0 ? "◐" : <FaTimes />}
                </span>
              )}
            </h5>
            <span className="badge bg-secondary">{question.points || 1} pts</span>
          </div>

          {question.title && <div className="fw-bold mb-2">{question.title}</div>}
          <div className="mb-3">{question.question}</div>

          {question.type === "MULTIPLE_CHOICE" && (
            <div>
              {displayChoices?.map((choice: string, choiceIndex: number) => {
                const isSelected = answers[question._id] === choice;

                return (
                  <Form.Check
                    key={choiceIndex}
                    type="radio"
                    name={`question-${question._id}`}
                    id={`question-${question._id}-choice-${choiceIndex}`}
                    label={choice}
                    checked={isSelected}
                    onChange={() => handleAnswerChange(question._id, choice)}
                    disabled={isViewingResults}
                    className="mb-2"
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
                className="mb-2"
              />
              <Form.Check
                type="radio"
                name={`question-${question._id}`}
                id={`question-${question._id}-false`}
                label="False"
                checked={answers[question._id] === false}
                onChange={() => handleAnswerChange(question._id, false)}
                disabled={isViewingResults}
                className="mb-2"
              />
            </div>
          )}

          {question.type === "FILL_BLANK" && (
            <div>
              {(!question.blanks || question.blanks.length === 0) ? (
                <Form.Control
                  type="text"
                  value={answers[question._id] || ""}
                  onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                  disabled={isViewingResults}
                  placeholder="Type your answer here..."
                />
              ) : (
                <>
                  {question.blanks.map((blank: any, blankIndex: number) => {
                    const userAnswersArray = Array.isArray(answers[question._id]) 
                      ? answers[question._id] 
                      : [];
                    
                    return (
                      <div key={blankIndex} className="mb-3">
                        <Form.Label>
                          Blank {blankIndex + 1} 
                          <span className="text-muted ms-2">({blank.points || 0} pts)</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={userAnswersArray[blankIndex] || ""}
                          onChange={(e) => {
                            const newAnswers = [...userAnswersArray];
                            newAnswers[blankIndex] = e.target.value;
                            handleAnswerChange(question._id, newAnswers);
                          }}
                          disabled={isViewingResults}
                          placeholder={`Answer for blank ${blankIndex + 1}`}
                        />
                      </div>
                    );
                  })}
                </>
              )}
              {isViewingResults && gradedAnswer && (
                <Alert 
                  variant={gradedAnswer.points === question.points ? "success" : gradedAnswer.points > 0 ? "warning" : "danger"} 
                  className="py-2 mt-2"
                >
                  <small>
                    <strong>Your Score:</strong> {gradedAnswer.points} / {question.points} pts
                    {gradedAnswer.points > 0 && gradedAnswer.points < question.points && (
                      <span className="ms-2">(Partial Credit)</span>
                    )}
                  </small>
                </Alert>
              )}
            </div>
          )}
        </Card.Body>
      </Card>
    );
  };

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

  if (!canTakeQuiz && !currentAttempt && latestAttempt) {
    return (
      <div className="wd-take-quiz" style={{ maxWidth: "900px", margin: "0 auto" }}>
        <Alert variant="warning" className="mb-4">
          <h4>No Attempts Remaining</h4>
          <p>You have used all {quiz.attemptsAllowed} attempts for this quiz.</p>
          <p className="mb-0">Below are the results from your last attempt.</p>
        </Alert>

        <Alert variant={latestAttempt.score >= (quiz.points || 0) * 0.7 ? "success" : "warning"} className="mb-4">
          <h4>Your Last Attempt Results</h4>
          <div className="fs-3">
            <strong>Score: {latestAttempt.score} / {latestAttempt.totalPoints}</strong>
            <span className="ms-3">
              ({((latestAttempt.score / (latestAttempt.totalPoints || 1)) * 100).toFixed(1)}%)
            </span>
          </div>
          <div className="mt-2">Submitted: {new Date(latestAttempt.submittedAt).toLocaleString()}</div>
        </Alert>

        {questions.map((question: any, index: number) => {
          const gradedAnswer = latestAttempt.answers?.find((a: any) => a.question === question._id);
          const userAnswer = gradedAnswer?.answer;
          
          const questionAnswers: { [key: string]: any } = {};
          if (userAnswer !== undefined) {
            questionAnswers[question._id] = userAnswer;
          }
          
          return (
            <Card className="mb-4" key={question._id}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h5>
                    Question {index + 1}
                    {gradedAnswer && (
                      <span className={`ms-2 ${gradedAnswer.correct ? "text-success" : gradedAnswer.points > 0 ? "text-warning" : "text-danger"}`}>
                        {gradedAnswer.correct ? <FaCheck /> : gradedAnswer.points > 0 ? "◐" : <FaTimes />}
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
                      const isSelected = questionAnswers[question._id] === choice;

                      return (
                        <Form.Check
                          key={choiceIndex}
                          type="radio"
                          name={`question-${question._id}`}
                          id={`question-${question._id}-choice-${choiceIndex}`}
                          label={choice}
                          checked={isSelected}
                          disabled={true}
                          className="mb-2"
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
                      checked={questionAnswers[question._id] === true}
                      disabled={true}
                      className="mb-2"
                    />
                    <Form.Check
                      type="radio"
                      name={`question-${question._id}`}
                      id={`question-${question._id}-false`}
                      label="False"
                      checked={questionAnswers[question._id] === false}
                      disabled={true}
                      className="mb-2"
                    />
                  </div>
                )}

                {question.type === "FILL_BLANK" && (
                  <div>
                    {(!question.blanks || question.blanks.length === 0) ? (
                      <Form.Control
                        type="text"
                        value={questionAnswers[question._id] || ""}
                        disabled={true}
                        placeholder="Type your answer here..."
                      />
                    ) : (
                      <>
                        {question.blanks.map((blank: any, blankIndex: number) => {
                          const userAnswersArray = Array.isArray(questionAnswers[question._id]) 
                            ? questionAnswers[question._id] 
                            : [];
                          
                          return (
                            <div key={blankIndex} className="mb-3">
                              <Form.Label>
                                Blank {blankIndex + 1} 
                                <span className="text-muted ms-2">({blank.points || 0} pts)</span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                value={userAnswersArray[blankIndex] || ""}
                                disabled={true}
                                placeholder={`Answer for blank ${blankIndex + 1}`}
                              />
                            </div>
                          );
                        })}
                      </>
                    )}
                    {gradedAnswer && (
                      <Alert 
                        variant={gradedAnswer.points === question.points ? "success" : gradedAnswer.points > 0 ? "warning" : "danger"} 
                        className="py-2 mt-2"
                      >
                        <small>
                          <strong>Your Score:</strong> {gradedAnswer.points} / {question.points} pts
                          {gradedAnswer.points > 0 && gradedAnswer.points < question.points && (
                            <span className="ms-2">(Partial Credit)</span>
                          )}
                        </small>
                      </Alert>
                    )}
                  </div>
                )}
              </Card.Body>
            </Card>
          );
        })}

        <div className="d-flex justify-content-end mt-4 border-top pt-4">
          <Button variant="primary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}>
            Back to Quiz Details
          </Button>
        </div>
      </div>
    );
  }

  if (!currentAttempt && !showResults) {
    return (
      <div style={{ maxWidth: "600px", margin: "50px auto" }}>
        <Card>
          <Card.Body>
            <h3>{quiz.title}</h3>
            <p className="text-muted">
              Attempt {attemptCount + 1} {quiz.multipleAttempts && `of ${quiz.attemptsAllowed}`}
            </p>
            
            {quiz.description && (
              <>
                <h5 className="mt-4">Quiz Instructions</h5>
                <p>{quiz.description}</p>
              </>
            )}

            <div className="mt-4">
              <div><strong>Total Points:</strong> {quiz.points || 0}</div>
              <div><strong>Questions:</strong> {questions.length}</div>
              <div>
                <strong>Time Limit:</strong>{" "}
                {quiz.hasTimeLimit === false ? "No Time Limit" : `${quiz.timeLimit} Minutes`}
              </div>
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>{quiz.title}</h2>
          <div className="text-muted">
            Attempt {currentAttempt?.attemptNumber || attemptCount + 1}
            {quiz.multipleAttempts && ` of ${quiz.attemptsAllowed}`}
          </div>
        </div>
        {!showResults && currentAttempt && quiz.hasTimeLimit !== false && (
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

      {!showResults && currentAttempt && Object.keys(answers).length > 0 && (
        <Alert variant="success" className="py-2 mb-3">
          <small>✓ Your answers are being saved automatically</small>
        </Alert>
      )}

      {showResults && submittedAttempt && (
        <Alert variant={submittedAttempt.score >= (quiz.points || 0) * 0.7 ? "success" : "warning"} className="mb-4">
          <h4>Quiz Results</h4>
          <div className="fs-3">
            <strong>Score: {submittedAttempt.score} / {submittedAttempt.totalPoints}</strong>
            <span className="ms-3">
              ({((submittedAttempt.score / (submittedAttempt.totalPoints || 1)) * 100).toFixed(1)}%)
            </span>
          </div>
          <div className="mt-2">Submitted: {new Date(submittedAttempt.submittedAt).toLocaleString()}</div>
        </Alert>
      )}

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

      <Modal show={showSubmitModal} onHide={() => setShowSubmitModal(false)} centered>
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
