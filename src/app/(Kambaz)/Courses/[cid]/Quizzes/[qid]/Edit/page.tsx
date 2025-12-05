/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../../store";
import { setQuizzes, updateQuiz } from "../../reducer";
import * as client from "../../../../client";
import {
  Button,
  Card,
  Col,
  Form,
  FormControl,
  InputGroup,
  Row,
  Nav,
  NavItem,
  NavLink,
} from "react-bootstrap";
import RichTextEditor from "./RichTextEditor";

export default function QuizEditor() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const isFaculty = (currentUser as any)?.role === "FACULTY";
  const [activeTab, setActiveTab] = useState("details");

  const quiz = quizzes.find((q: any) => q._id === qid) as any;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quizType, setQuizType] = useState("Graded Quiz");
  const [points, setPoints] = useState(0);
  const [assignmentGroup, setAssignmentGroup] = useState("QUIZZES");
  const [shuffleAnswers, setShuffleAnswers] = useState(true);
  const [timeLimit, setTimeLimit] = useState(20);
  const [multipleAttempts, setMultipleAttempts] = useState(false);
  const [attemptsAllowed, setAttemptsAllowed] = useState(1);
  const [showCorrectAnswers, setShowCorrectAnswers] = useState("Never");
  const [accessCode, setAccessCode] = useState("");
  const [oneQuestionAtATime, setOneQuestionAtATime] = useState(true);
  const [webcamRequired, setWebcamRequired] = useState(false);
  const [lockQuestionsAfterAnswering, setLockQuestionsAfterAnswering] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [availableDate, setAvailableDate] = useState("");
  const [availableUntilDate, setAvailableUntilDate] = useState("");

  const formatForInput = (dateString: string) => {
    if (!dateString) return "";
    const regex = /(\w+)\s+(\d+)(?:,?\s*(\d{4}))?\s+at\s+(\d+):(\d+)\s*(am|pm)/i;
    const match = dateString.match(regex);
    if (!match) return "";

    const [, monthStr, dayStr, yearStr, hourStr, minStr, ampm] = match;
    const monthNames = [
      "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"
    ];
    const month = monthNames.findIndex(
      (m) => m.toLowerCase() === monthStr.toLowerCase()
    );
    if (month === -1) return "";

    const day = parseInt(dayStr, 10);
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minStr, 10);
    const year = yearStr ? parseInt(yearStr, 10) : new Date().getFullYear();

    if (ampm.toLowerCase() === "pm" && hour !== 12) hour += 12;
    if (ampm.toLowerCase() === "am" && hour === 12) hour = 0;

    const date = new Date(year, month, day, hour, minute);
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const formatForDisplay = (dateTimeLocal: string) => {
    if (!dateTimeLocal) return "";
    const date = new Date(dateTimeLocal);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    let hour = date.getHours();
    const minute = date.getMinutes();
    const ampm = hour >= 12 ? "pm" : "am";
    hour = hour % 12 || 12;
    const minStr = minute.toString().padStart(2, "0");
    return `${month} ${day}, ${year} at ${hour}:${minStr} ${ampm}`;
  };

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
    if (quiz) {
      setTitle(quiz.title || "");
      setDescription(quiz.description || "");
      setQuizType(quiz.quizType || "Graded Quiz");
      setPoints(quiz.points || 0);
      setAssignmentGroup(quiz.assignmentGroup || "QUIZZES");
      setShuffleAnswers(quiz.shuffleAnswers !== false);
      setTimeLimit(quiz.timeLimit || 20);
      setMultipleAttempts(quiz.multipleAttempts || false);
      setAttemptsAllowed(quiz.attemptsAllowed || 1);
      setShowCorrectAnswers(quiz.showCorrectAnswers || "Never");
      setAccessCode(quiz.accessCode || "");
      setOneQuestionAtATime(quiz.oneQuestionAtATime !== false);
      setWebcamRequired(quiz.webcamRequired || false);
      setLockQuestionsAfterAnswering(quiz.lockQuestionsAfterAnswering || false);
      setDueDate(formatForInput(quiz["Due Date"] || ""));
      setAvailableDate(formatForInput(quiz["Available Date"] || ""));
      setAvailableUntilDate(formatForInput(quiz["Available Until Date"] || ""));
    }
  }, [quiz]);

  if (!isFaculty) {
    return <div className="p-4">Access denied. Only faculty can edit quizzes.</div>;
  }

  if (!quiz) {
    return <div className="p-4">Loading...</div>;
  }

  const handleSave = async () => {
    const quizData: any = {
      _id: quiz._id,
      title,
      description,
      quizType,
      points: parseInt(points.toString(), 10),
      assignmentGroup,
      shuffleAnswers,
      timeLimit: parseInt(timeLimit.toString(), 10),
      multipleAttempts,
      attemptsAllowed: parseInt(attemptsAllowed.toString(), 10),
      showCorrectAnswers,
      accessCode,
      oneQuestionAtATime,
      webcamRequired,
      lockQuestionsAfterAnswering,
      "Due Date": formatForDisplay(dueDate),
      "Available Date": formatForDisplay(availableDate),
      "Available Until Date": formatForDisplay(availableUntilDate),
      course: cid,
    };

    await client.updateQuiz(quizData);
    dispatch(updateQuiz(quizData));
    router.push(`/Courses/${cid}/Quizzes/${qid}`);
  };

  const handleSaveAndPublish = async () => {
    const quizData: any = {
      _id: quiz._id,
      title,
      description,
      quizType,
      points: parseInt(points.toString(), 10),
      assignmentGroup,
      shuffleAnswers,
      timeLimit: parseInt(timeLimit.toString(), 10),
      multipleAttempts,
      attemptsAllowed: parseInt(attemptsAllowed.toString(), 10),
      showCorrectAnswers,
      accessCode,
      oneQuestionAtATime,
      webcamRequired,
      lockQuestionsAfterAnswering,
      "Due Date": formatForDisplay(dueDate),
      "Available Date": formatForDisplay(availableDate),
      "Available Until Date": formatForDisplay(availableUntilDate),
      course: cid,
      published: true,
    };

    await client.updateQuiz(quizData);
    dispatch(updateQuiz(quizData));
    router.push(`/Courses/${cid}/Quizzes`);
  };

  const handleCancel = () => {
    router.push(`/Courses/${cid}/Quizzes`);
  };

  return (
    <div
      id="wd-quiz-editor"
      className="container-fluid"
      style={{ maxWidth: "800px", float: "left" }}
    >
      <div className="d-flex justify-content-end align-items-center mb-3 border-bottom pb-3">
        <div className="d-flex align-items-center gap-2">
          <span className="text-dark">Points {points}</span>
          {quiz.published ? (
            <span className="text-muted">✅ Published</span>
          ) : (
            <span className="text-muted">🚫 Not Published</span>
          )}
          <Button variant="light" size="sm" className="border">
            <span>⋮</span>
          </Button>
        </div>
      </div>

      <Nav variant="tabs" className="mb-3">
        <NavItem>
          <NavLink
            active={activeTab === "details"}
            onClick={() => setActiveTab("details")}
            style={{ cursor: "pointer" }}
          >
            Details
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={activeTab === "questions"}
            onClick={() => {
              setActiveTab("questions");
            }}
            style={{ cursor: "pointer" }}
          >
            Questions
          </NavLink>
        </NavItem>
      </Nav>

      {activeTab === "details" && (
        <Form>
          <Form.Group className="mb-3" controlId="wd-quiz-title">
            <Form.Label className="fw-semibold">Quiz Title</Form.Label>
            <Form.Control
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Unnamed Quiz"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="wd-quiz-instructions">
            <Form.Label className="fw-semibold">Quiz Instructions:</Form.Label>
            <RichTextEditor
              value={description}
              onChange={setDescription}
            />
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="wd-quiz-type">
            <Form.Label column sm={3} className="text-sm-end">Quiz Type</Form.Label>
            <Col sm={9}>
              <Form.Select
                value={quizType}
                onChange={(e) => setQuizType(e.target.value)}
              >
                <option>Graded Quiz</option>
                <option>Practice Quiz</option>
                <option>Graded Survey</option>
                <option>Ungraded Survey</option>
              </Form.Select>
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="wd-points">
            <Form.Label column sm={3} className="text-sm-end">Points</Form.Label>
            <Col sm={9}>
              <Form.Control
                type="number"
                value={points}
                onChange={(e) => setPoints(parseInt(e.target.value, 10) || 0)}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="wd-assignment-group">
            <Form.Label column sm={3} className="text-sm-end">Assignment Group</Form.Label>
            <Col sm={9}>
              <Form.Select
                value={assignmentGroup}
                onChange={(e) => setAssignmentGroup(e.target.value)}
              >
                <option>QUIZZES</option>
                <option>EXAMS</option>
                <option>ASSIGNMENTS</option>
                <option>PROJECT</option>
              </Form.Select>
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="wd-options">
            <Form.Label column sm={3} className="text-sm-end">Options</Form.Label>
            <Col sm={9}>
              <Card className="border rounded-3">
                <Card.Body className="p-3">
                  <Form.Check
                    id="wd-shuffle-answers"
                    type="checkbox"
                    label="Shuffle Answers"
                    checked={shuffleAnswers}
                    onChange={(e) => setShuffleAnswers(e.target.checked)}
                    className="mb-3"
                  />

                  <div className="mb-3">
                    <Form.Check
                      id="wd-time-limit"
                      type="checkbox"
                      label="Time Limit"
                      checked={timeLimit > 0}
                      onChange={(e) => setTimeLimit(e.target.checked ? 20 : 0)}
                      className="mb-2"
                    />
                    {timeLimit > 0 && (
                      <InputGroup style={{ width: "200px", marginLeft: "20px" }}>
                        <Form.Control
                          type="number"
                          value={timeLimit}
                          onChange={(e) => setTimeLimit(parseInt(e.target.value, 10) || 20)}
                          min="1"
                        />
                        <InputGroup.Text>Minutes</InputGroup.Text>
                      </InputGroup>
                    )}
                  </div>

                  <div className="mb-3">
                    <Form.Check
                      id="wd-multiple-attempts"
                      type="checkbox"
                      label="Allow Multiple Attempts"
                      checked={multipleAttempts}
                      onChange={(e) => setMultipleAttempts(e.target.checked)}
                      className="mb-2"
                    />
                    {multipleAttempts && (
                      <InputGroup style={{ width: "200px", marginLeft: "20px" }}>
                        <Form.Control
                          type="number"
                          value={attemptsAllowed}
                          onChange={(e) => setAttemptsAllowed(parseInt(e.target.value, 10) || 1)}
                          min="1"
                        />
                        <InputGroup.Text>Attempts</InputGroup.Text>
                      </InputGroup>
                    )}
                  </div>

                  <Form.Group className="mb-3">
                    <Form.Label>Show Correct Answers</Form.Label>
                    <Form.Select
                      value={showCorrectAnswers}
                      onChange={(e) => setShowCorrectAnswers(e.target.value)}
                    >
                      <option>Never</option>
                      <option>After the last attempt</option>
                      <option>After the due date</option>
                      <option>Immediately</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Access Code</Form.Label>
                    <Form.Control
                      type="text"
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                      placeholder="(No access code)"
                    />
                  </Form.Group>

                  <Form.Check
                    id="wd-one-question"
                    type="checkbox"
                    label="One Question at a Time"
                    checked={oneQuestionAtATime}
                    onChange={(e) => setOneQuestionAtATime(e.target.checked)}
                    className="mb-3"
                  />

                  <Form.Check
                    id="wd-webcam"
                    type="checkbox"
                    label="Webcam Required"
                    checked={webcamRequired}
                    onChange={(e) => setWebcamRequired(e.target.checked)}
                    className="mb-3"
                  />

                  <Form.Check
                    id="wd-lock-questions"
                    type="checkbox"
                    label="Lock Questions After Answering"
                    checked={lockQuestionsAfterAnswering}
                    onChange={(e) => setLockQuestionsAfterAnswering(e.target.checked)}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mt-3" controlId="wd-assign">
            <Form.Label column sm={3} className="text-sm-end">Assign</Form.Label>
            <Col sm={9}>
              <Card className="border">
                <Card.Body className="p-3">
                  <div className="mb-3">
                    <div className="fw-semibold mb-1">Assign to</div>
                    <div className="form-control d-flex align-items-center flex-wrap gap-2">
                      <span className="badge text-bg-light px-3 py-2 border">
                        Everyone <span className="ms-2 text-muted" aria-hidden>&times;</span>
                      </span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="fw-semibold mb-1">Due</div>
                    <InputGroup>
                      <Form.Control
                        type="datetime-local"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                      />
                    </InputGroup>
                  </div>

                  <Row>
                    <Col sm={6} className="mb-3">
                      <div className="fw-semibold mb-1">Available from</div>
                      <InputGroup>
                        <Form.Control
                          type="datetime-local"
                          value={availableDate}
                          onChange={(e) => setAvailableDate(e.target.value)}
                        />
                      </InputGroup>
                    </Col>

                    <Col sm={6} className="mb-2">
                      <div className="fw-semibold mb-1">Until</div>
                      <InputGroup>
                        <Form.Control
                          type="datetime-local"
                          value={availableUntilDate}
                          onChange={(e) => setAvailableUntilDate(e.target.value)}
                        />
                      </InputGroup>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Form.Group>

          <hr />

          <div className="d-flex justify-content-end gap-2">
            <Button
              id="wd-cancel"
              variant="light"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              id="wd-save"
              variant="danger"
              onClick={handleSave}
            >
              Save
            </Button>
            <Button
              id="wd-save-publish"
              variant="danger"
              onClick={handleSaveAndPublish}
            >
              Save & Publish
            </Button>
          </div>
        </Form>
      )}

      {activeTab === "questions" && (
        <div className="p-4">
          <p className="text-muted">Questions tab content will be implemented here.</p>
        </div>
      )}
    </div>
  );
}
