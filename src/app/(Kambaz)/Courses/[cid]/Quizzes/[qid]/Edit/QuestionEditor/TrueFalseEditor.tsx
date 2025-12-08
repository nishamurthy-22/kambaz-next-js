/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";

interface TrueFalseEditorProps {
  question: any;
  onCancel: () => void;
  onSave: (updatedQuestion: any) => void;
}

export default function TrueFalseEditor({
  question,
  onCancel,
  onSave,
}: TrueFalseEditorProps) {
  const [title, setTitle] = useState(question.title || "");
  const [questionText, setQuestionText] = useState(question.question || "");
  const [points, setPoints] = useState(question.points || 1);
  const [correctAnswer, setCorrectAnswer] = useState(
    question.correctAnswer !== undefined ? question.correctAnswer : true
  );

  useEffect(() => {
    setTitle(question.title || "");
    setQuestionText(question.question || "");
    setPoints(question.points || 1);
    setCorrectAnswer(
      question.correctAnswer !== undefined ? question.correctAnswer : true
    );
  }, [question._id]);

  const handleSaveClick = () => {
    const updatedQuestion = {
      ...question,
      title,
      question: questionText,
      points,
      correctAnswer,
      type: "TRUE_FALSE"
    };
    
    onSave(updatedQuestion);
  };

  return (
    <div className="border p-4 mb-3 bg-light">
      <Form>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0">True/False Question</h6>
          <Form.Label className="mb-0">
            <strong>Points:</strong>
            <Form.Control
              type="number"
              value={points}
              onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
              min="0"
              style={{ width: "80px", display: "inline-block", marginLeft: "10px" }}
            />
          </Form.Label>
        </div>

        <Form.Group className="mb-3">
          <Form.Label>Question Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter question title"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Question</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Enter your true/false statement..."
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Correct Answer:</Form.Label>
          <div>
            <Form.Check
              type="radio"
              label="True"
              name="correctAnswer"
              checked={correctAnswer === true}
              onChange={() => setCorrectAnswer(true)}
              className="mb-2"
            />
            <Form.Check
              type="radio"
              label="False"
              name="correctAnswer"
              checked={correctAnswer === false}
              onChange={() => setCorrectAnswer(false)}
            />
          </div>
        </Form.Group>

        <div className="d-flex justify-content-end gap-2 mt-4">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleSaveClick}>
            Update Question
          </Button>
        </div>
      </Form>
    </div>
  );
}
