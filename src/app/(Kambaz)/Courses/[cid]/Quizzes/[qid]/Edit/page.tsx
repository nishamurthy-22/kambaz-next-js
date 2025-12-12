/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../../store";
import { setQuizzes, updateQuiz } from "../../reducer";
import * as client from "../../../../client";
import { Button, Form, Nav, Tab, Row, Col, Alert, Container } from "react-bootstrap";
import QuestionsTab from "./QuestionsTab";

export default function QuizEditor() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);

  const [activeTab, setActiveTab] = useState("details");
  const [quiz, setQuiz] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

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
    const foundQuiz = quizzes.find((q: any) => q._id === qid) as any;
    if (foundQuiz) {
      setQuiz(foundQuiz);
      setFormData({
        ...foundQuiz,
        questions: foundQuiz.questions || []
      });
    }
  }, [quizzes, qid]);

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    setValidationErrors([]);
  };

  const handleQuestionsChange = async (questions: any[]) => {
    const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);
    const updatedFormData = {
      ...formData,
      questions,
      points: totalPoints,
      "Questions": questions.length
    };
    
    setFormData(updatedFormData);
    setValidationErrors([]);

    try {
      const updatedQuiz = await client.updateQuiz(updatedFormData);
      dispatch(updateQuiz(updatedQuiz));
    } catch (error) {
    }
  };

  const validateQuizForPublish = (): string[] => {
    const errors: string[] = [];

    if (!formData.title || formData.title.trim() === "") {
      errors.push("Quiz must have a title before publishing");
    }

    if (!formData.questions || formData.questions.length === 0) {
      errors.push("Quiz must have at least one question before publishing");
    }

    formData.questions?.forEach((q: any, index: number) => {
      if (!q.question || q.question.trim() === "") {
        errors.push(`Question ${index + 1} is missing question text`);
      }
      if (q.type === "MULTIPLE_CHOICE") {
        if (!q.choices || q.choices.length < 2) {
          errors.push(`Question ${index + 1} must have at least 2 choices`);
        }
        const hasEmptyChoice = q.choices?.some((c: string) => !c || c.trim() === "");
        if (hasEmptyChoice) {
          errors.push(`Question ${index + 1} has empty choices`);
        }
      }
      if (q.type === "FILL_BLANK") {
        if (!q.blanks || !Array.isArray(q.blanks) || q.blanks.length === 0) {
          errors.push(`Question ${index + 1} must have at least one blank`);
        } else {
          q.blanks.forEach((blank: any, blankIndex: number) => {
            if (!blank.possibleAnswers || blank.possibleAnswers.length === 0) {
              errors.push(`Question ${index + 1}, Blank ${blankIndex + 1} must have at least one possible answer`);
            }
            const hasEmptyAnswer = blank.possibleAnswers?.some((a: string) => !a || a.trim() === "");
            if (hasEmptyAnswer) {
              errors.push(`Question ${index + 1}, Blank ${blankIndex + 1} has empty answers`);
            }
          });
        }
      }
    });

    if (!formData["Available Date"] || formData["Available Date"].trim() === "") {
      errors.push("'Available From' date is required before publishing");
    }

    if (!formData["Due Date"] || formData["Due Date"].trim() === "") {
      errors.push("'Due Date' is required before publishing");
    }

    if (!formData["Available Until Date"] || formData["Available Until Date"].trim() === "") {
      errors.push("'Until' date is required before publishing");
    }

    const availableDate = formData["Available Date"] ? new Date(formData["Available Date"]) : null;
    const availableUntilDate = formData["Available Until Date"] ? new Date(formData["Available Until Date"]) : null;
    const dueDate = formData["Due Date"] ? new Date(formData["Due Date"]) : null;

    if (availableDate && availableUntilDate && availableDate >= availableUntilDate) {
      errors.push("'Available From' date must be before 'Until' date");
    }

    if (availableDate && dueDate && availableDate > dueDate) {
      errors.push("'Available From' date must be before or equal to 'Due' date");
    }

    if (dueDate && availableUntilDate && dueDate > availableUntilDate) {
      errors.push("'Due' date must be before or equal to 'Until' date");
    }

    return errors;
  };

  const handleUnpublish = async () => {
    try {
      const updatedQuiz = { ...formData, published: false };
      await client.updateQuiz(updatedQuiz);
      dispatch(updateQuiz(updatedQuiz));
      setFormData(updatedQuiz);
    } catch (error) {
      alert("Failed to unpublish quiz");
    }
  };

  const handleSave = async () => {
    setValidationErrors([]);

    try {
      const updatedQuiz = await client.updateQuiz(formData);
      dispatch(updateQuiz(updatedQuiz));
      router.push(`/Courses/${cid}/Quizzes/${qid}`);
    } catch (error) {
      alert("Failed to update quiz");
    }
  };

  const handleSaveAndPublish = async () => {
    const errors = validateQuizForPublish();
    if (errors.length > 0) {
      setValidationErrors(errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      const dataToSend = { ...formData, published: true };
      const updatedQuiz = await client.updateQuiz(dataToSend);
      dispatch(updateQuiz(updatedQuiz));
      router.push(`/Courses/${cid}/Quizzes`);
    } catch (error) {
      alert("Failed to update quiz");
    }
  };

  const handleCancel = () => {
    router.push(`/Courses/${cid}/Quizzes`);
  };

  if (!quiz) {
    return <div>Loading...</div>;
  }

  const isPublished = quiz.published || formData.published;

  return (
    <Container fluid className="px-4 py-3" style={{ maxWidth: "1200px" }}>
      <div className="wd-quiz-editor">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Edit Quiz</h2>
          <div>
            <span className="me-3">
              <strong>Points:</strong> {formData.points || 0}
            </span>
            <span className="me-3">
              <strong>Questions:</strong> {formData.questions?.length || 0}
            </span>
            <span className={formData.published ? "text-success" : "text-danger"}>
              {formData.published ? "Published" : "Not Published"}
            </span>
          </div>
        </div>

        {isPublished && (
          <Alert variant="warning">
            <Alert.Heading>Quiz is Published</Alert.Heading>
            <p>This quiz is currently published and visible to students. You must unpublish it before making edits.</p>
            <Button variant="warning" size="sm" onClick={handleUnpublish}>
              Unpublish Quiz
            </Button>
          </Alert>
        )}

        {validationErrors.length > 0 && (
          <Alert variant="danger" dismissible onClose={() => setValidationErrors([])}>
            <Alert.Heading>Cannot Publish Quiz</Alert.Heading>
            <p className="mb-2">Please fix the following issues before publishing:</p>
            <ul className="mb-0">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </Alert>
        )}

        <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k || "details")}>
          <Nav variant="tabs" className="mb-4">
            <Nav.Item>
              <Nav.Link eventKey="details">Details</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="questions">Questions</Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            <Tab.Pane eventKey="details">
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.title || ""}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Quiz Title"
                    disabled={isPublished}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Quiz Instructions</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={formData.description || ""}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Enter quiz instructions..."
                    disabled={isPublished}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Quiz Type</Form.Label>
                  <Form.Select
                    value={formData.quizType || "Graded Quiz"}
                    onChange={(e) => handleInputChange("quizType", e.target.value)}
                    disabled={isPublished}
                  >
                    <option value="Graded Quiz">Graded Quiz</option>
                    <option value="Practice Quiz">Practice Quiz</option>
                    <option value="Graded Survey">Graded Survey</option>
                    <option value="Ungraded Survey">Ungraded Survey</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Assignment Group</Form.Label>
                  <Form.Select
                    value={formData.assignmentGroup || "QUIZZES"}
                    onChange={(e) => handleInputChange("assignmentGroup", e.target.value)}
                    disabled={isPublished}
                  >
                    <option value="QUIZZES">Quizzes</option>
                    <option value="EXAMS">Exams</option>
                    <option value="ASSIGNMENTS">Assignments</option>
                    <option value="PROJECT">Project</option>
                  </Form.Select>
                </Form.Group>

                <hr />

                <h5 className="mb-3">Options</h5>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Shuffle Answers"
                    checked={formData.shuffleAnswers !== false}
                    onChange={(e) => handleInputChange("shuffleAnswers", e.target.checked)}
                    disabled={isPublished}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Set Time Limit"
                    checked={formData.hasTimeLimit !== false}
                    onChange={(e) => handleInputChange("hasTimeLimit", e.target.checked)}
                    disabled={isPublished}
                  />
                </Form.Group>

                {formData.hasTimeLimit !== false && (
                  <Form.Group className="mb-3">
                    <Form.Label>Time Limit (Minutes)</Form.Label>
                    <Form.Control
                      type="number"
                      value={formData.timeLimit || 20}
                      onChange={(e) => handleInputChange("timeLimit", parseInt(e.target.value))}
                      min="1"
                      disabled={isPublished}
                    />
                  </Form.Group>
                )}

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Allow Multiple Attempts"
                    checked={formData.multipleAttempts || false}
                    onChange={(e) => handleInputChange("multipleAttempts", e.target.checked)}
                    disabled={isPublished}
                  />
                </Form.Group>

                {formData.multipleAttempts && (
                  <Form.Group className="mb-3">
                    <Form.Label>How Many Attempts</Form.Label>
                    <Form.Control
                      type="number"
                      value={formData.attemptsAllowed || 1}
                      onChange={(e) => handleInputChange("attemptsAllowed", parseInt(e.target.value))}
                      min="1"
                      disabled={isPublished}
                    />
                  </Form.Group>
                )}

                <Form.Group className="mb-3">
                  <Form.Label>Show Correct Answers</Form.Label>
                  <Form.Select
                    value={formData.showCorrectAnswers || "Never"}
                    onChange={(e) => handleInputChange("showCorrectAnswers", e.target.value)}
                    disabled={isPublished}
                  >
                    <option value="Immediately">Immediately</option>
                    <option value="After Due Date">After Due Date</option>
                    <option value="Never">Never</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Access Code</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.accessCode || ""}
                    onChange={(e) => handleInputChange("accessCode", e.target.value)}
                    placeholder="Optional access code"
                    disabled={isPublished}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="One Question at a Time"
                    checked={formData.oneQuestionAtATime !== false}
                    onChange={(e) => handleInputChange("oneQuestionAtATime", e.target.checked)}
                    disabled={isPublished}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Webcam Required"
                    checked={formData.webcamRequired || false}
                    onChange={(e) => handleInputChange("webcamRequired", e.target.checked)}
                    disabled={isPublished}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Lock Questions After Answering"
                    checked={formData.lockQuestionsAfterAnswering || false}
                    onChange={(e) => handleInputChange("lockQuestionsAfterAnswering", e.target.checked)}
                    disabled={isPublished}
                  />
                </Form.Group>

                <hr />

                <h5 className="mb-3">Assign</h5>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Available From <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="datetime-local"
                        value={formData["Available Date"] || ""}
                        onChange={(e) => handleInputChange("Available Date", e.target.value)}
                        disabled={isPublished}
                      />
                      <Form.Text className="text-muted">
                        Required for publishing
                      </Form.Text>
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Due Date <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="datetime-local"
                        value={formData["Due Date"] || ""}
                        onChange={(e) => handleInputChange("Due Date", e.target.value)}
                        disabled={isPublished}
                      />
                      <Form.Text className="text-muted">
                        Required for publishing
                      </Form.Text>
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Until <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="datetime-local"
                        value={formData["Available Until Date"] || ""}
                        onChange={(e) => handleInputChange("Available Until Date", e.target.value)}
                        disabled={isPublished}
                      />
                      <Form.Text className="text-muted">
                        Required for publishing
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Tab.Pane>

            <Tab.Pane eventKey="questions">
              {isPublished ? (
                <Alert variant="warning">
                  <Alert.Heading>Cannot Edit Questions</Alert.Heading>
                  <p>This quiz is published. You must unpublish it before editing questions.</p>
                  <Button variant="warning" size="sm" onClick={handleUnpublish}>
                    Unpublish Quiz
                  </Button>
                </Alert>
              ) : (
                <QuestionsTab
                  questions={formData.questions || []}
                  onQuestionsChange={handleQuestionsChange}
                />
              )}
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>

        <div className="d-flex justify-content-end gap-2 mt-4 border-top pt-3 mb-4">
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={isPublished}>
            Save
          </Button>
          <Button variant="success" onClick={handleSaveAndPublish} disabled={isPublished}>
            Save & Publish
          </Button>
        </div>
      </div>
    </Container>
  );
}
