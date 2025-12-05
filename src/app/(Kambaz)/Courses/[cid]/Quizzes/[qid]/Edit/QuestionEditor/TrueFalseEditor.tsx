/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Button } from "react-bootstrap";

interface TrueFalseEditorProps {
  question: any;
  onChange: (question: any) => void;
  onCancel: () => void;
  onSave: () => void;
}

export default function TrueFalseEditor({
  question,
  onChange,
  onCancel,
  onSave,
}: TrueFalseEditorProps) {
  const handleFieldChange = (field: string, value: any) => {
    onChange({ ...question, [field]: value });
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
              value={question.points || 1}
              onChange={(e) => handleFieldChange("points", parseInt(e.target.value))}
              min="0"
              style={{ width: "80px", display: "inline-block", marginLeft: "10px" }}
            />
          </Form.Label>
        </div>

        {/* Title */}
        <Form.Group className="mb-3">
          <Form.Label>Question Title</Form.Label>
          <Form.Control
            type="text"
            value={question.title || ""}
            onChange={(e) => handleFieldChange("title", e.target.value)}
            placeholder="Enter question title"
          />
        </Form.Group>

        {/* Question Text */}
        <Form.Group className="mb-3">
          <Form.Label>Question</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={question.question || ""}
            onChange={(e) => handleFieldChange("question", e.target.value)}
            placeholder="Enter your true/false statement..."
          />
        </Form.Group>

        {/* Correct Answer */}
        <Form.Group className="mb-3">
          <Form.Label>Correct Answer:</Form.Label>
          <div>
            <Form.Check
              type="radio"
              label="True"
              name="correctAnswer"
              checked={question.correctAnswer === true}
              onChange={() => handleFieldChange("correctAnswer", true)}
              className="mb-2"
            />
            <Form.Check
              type="radio"
              label="False"
              name="correctAnswer"
              checked={question.correctAnswer === false}
              onChange={() => handleFieldChange("correctAnswer", false)}
            />
          </div>
        </Form.Group>

        {/* Action Buttons */}
        <div className="d-flex justify-content-end gap-2 mt-4">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onSave}>
            Update Question
          </Button>
        </div>
      </Form>
    </div>
  );
}
