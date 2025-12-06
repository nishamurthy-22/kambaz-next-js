/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../../store";
import { setQuizzes, updateQuiz } from "../../reducer";
import * as client from "../../../../client";
import { Button, Form, Nav, Tab, Row, Col } from "react-bootstrap";
import QuestionsTab from "./QuestionsTab";

export default function QuizEditor() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);
  
  const [activeTab, setActiveTab] = useState("details");
  const [quiz, setQuiz] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

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
        questions: (foundQuiz as any).questions || []
      });
    }
  }, [quizzes, qid]);

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleQuestionsChange = (questions: any[]) => {
    // Calculate total points
    const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);
    setFormData({ 
      ...formData, 
      questions, 
      points: totalPoints,
      "Questions": questions.length 
    });
  };

  const handleSave = async () => {
    try {
      const updatedQuiz = await client.updateQuiz(formData);
      dispatch(updateQuiz(updatedQuiz));
      router.push(`/Courses/${cid}/Quizzes/${qid}`);
    } catch (error) {
      console.error("Error updating quiz:", error);
      alert("Failed to update quiz");
    }
  };

  const handleSaveAndPublish = async () => {
    try {
      const updatedQuiz = await client.updateQuiz({ ...formData, published: true });
      dispatch(updateQuiz(updatedQuiz));
      router.push(`/Courses/${cid}/Quizzes`);
    } catch (error) {
      console.error("Error updating quiz:", error);
      alert("Failed to update quiz");
    }
  };

  const handleCancel = () => {
    router.push(`/Courses/${cid}/Quizzes`);
  };

  if (!quiz) {
    return <div>Loading...</div>;
  }

  return (
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
              {/* Title */}
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.title || ""}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Quiz Title"
                />
              </Form.Group>

              {/* Description */}
              <Form.Group className="mb-3">
                <Form.Label>Quiz Instructions</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={formData.description || ""}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Enter quiz instructions..."
                />
              </Form.Group>

              {/* Quiz Type */}
              <Form.Group className="mb-3">
                <Form.Label>Quiz Type</Form.Label>
                <Form.Select
                  value={formData.quizType || "Graded Quiz"}
                  onChange={(e) => handleInputChange("quizType", e.target.value)}
                >
                  <option value="Graded Quiz">Graded Quiz</option>
                  <option value="Practice Quiz">Practice Quiz</option>
                  <option value="Graded Survey">Graded Survey</option>
                  <option value="Ungraded Survey">Ungraded Survey</option>
                </Form.Select>
              </Form.Group>

              {/* Assignment Group */}
              <Form.Group className="mb-3">
                <Form.Label>Assignment Group</Form.Label>
                <Form.Select
                  value={formData.assignmentGroup || "QUIZZES"}
                  onChange={(e) => handleInputChange("assignmentGroup", e.target.value)}
                >
                  <option value="QUIZZES">Quizzes</option>
                  <option value="EXAMS">Exams</option>
                  <option value="ASSIGNMENTS">Assignments</option>
                  <option value="PROJECT">Project</option>
                </Form.Select>
              </Form.Group>

              <hr />

              {/* Options Section */}
              <h5 className="mb-3">Options</h5>

              {/* Shuffle Answers */}
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Shuffle Answers"
                  checked={formData.shuffleAnswers !== false}
                  onChange={(e) => handleInputChange("shuffleAnswers", e.target.checked)}
                />
              </Form.Group>

              {/* Time Limit */}
              <Form.Group className="mb-3">
                <Form.Label>Time Limit (Minutes)</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.timeLimit || 20}
                  onChange={(e) => handleInputChange("timeLimit", parseInt(e.target.value))}
                  min="0"
                />
              </Form.Group>

              {/* Multiple Attempts */}
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Allow Multiple Attempts"
                  checked={formData.multipleAttempts || false}
                  onChange={(e) => handleInputChange("multipleAttempts", e.target.checked)}
                />
              </Form.Group>

              {/* How Many Attempts */}
              {formData.multipleAttempts && (
                <Form.Group className="mb-3">
                  <Form.Label>How Many Attempts</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.attemptsAllowed || 1}
                    onChange={(e) => handleInputChange("attemptsAllowed", parseInt(e.target.value))}
                    min="1"
                  />
                </Form.Group>
              )}

              {/* Show Correct Answers */}
              <Form.Group className="mb-3">
                <Form.Label>Show Correct Answers</Form.Label>
                <Form.Select
                  value={formData.showCorrectAnswers || "Never"}
                  onChange={(e) => handleInputChange("showCorrectAnswers", e.target.value)}
                >
                  <option value="Immediately">Immediately</option>
                  <option value="After Due Date">After Due Date</option>
                  <option value="Never">Never</option>
                </Form.Select>
              </Form.Group>

              {/* Access Code */}
              <Form.Group className="mb-3">
                <Form.Label>Access Code</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.accessCode || ""}
                  onChange={(e) => handleInputChange("accessCode", e.target.value)}
                  placeholder="Optional access code"
                />
              </Form.Group>

              {/* One Question at a Time */}
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="One Question at a Time"
                  checked={formData.oneQuestionAtATime !== false}
                  onChange={(e) => handleInputChange("oneQuestionAtATime", e.target.checked)}
                />
              </Form.Group>

              {/* Webcam Required */}
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Webcam Required"
                  checked={formData.webcamRequired || false}
                  onChange={(e) => handleInputChange("webcamRequired", e.target.checked)}
                />
              </Form.Group>

              {/* Lock Questions After Answering */}
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Lock Questions After Answering"
                  checked={formData.lockQuestionsAfterAnswering || false}
                  onChange={(e) => handleInputChange("lockQuestionsAfterAnswering", e.target.checked)}
                />
              </Form.Group>

              <hr />

              {/* Assignment Dates */}
              <h5 className="mb-3">Assign</h5>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Due Date</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      value={formData["Due Date"] || ""}
                      onChange={(e) => handleInputChange("Due Date", e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Available From</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      value={formData["Available Date"] || ""}
                      onChange={(e) => handleInputChange("Available Date", e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Until</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      value={formData["Available Until Date"] || ""}
                      onChange={(e) => handleInputChange("Available Until Date", e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Tab.Pane>

          <Tab.Pane eventKey="questions">
            <QuestionsTab 
              questions={formData.questions || []} 
              onQuestionsChange={handleQuestionsChange}
            />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      {/* Action Buttons */}
      <div className="d-flex justify-content-end gap-2 mt-4 border-top pt-3">
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
        <Button variant="success" onClick={handleSaveAndPublish}>
          Save & Publish
        </Button>
      </div>
    </div>
  );
}
