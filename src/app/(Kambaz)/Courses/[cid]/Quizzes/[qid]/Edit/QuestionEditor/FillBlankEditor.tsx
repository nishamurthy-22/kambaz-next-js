/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Button } from "react-bootstrap";
import { BsTrash } from "react-icons/bs";

interface FillBlankEditorProps {
  question: any;
  onChange: (question: any) => void;
  onCancel: () => void;
  onSave: () => void;
}

export default function FillBlankEditor({
  question,
  onChange,
  onCancel,
  onSave,
}: FillBlankEditorProps) {
  const handleFieldChange = (field: string, value: any) => {
    onChange({ ...question, [field]: value });
  };

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...(question.possibleAnswers || [""])];
    newAnswers[index] = value;
    onChange({ ...question, possibleAnswers: newAnswers });
  };

  const handleAddAnswer = () => {
    const newAnswers = [...(question.possibleAnswers || []), ""];
    onChange({ ...question, possibleAnswers: newAnswers });
  };

  const handleRemoveAnswer = (index: number) => {
    if ((question.possibleAnswers?.length || 0) <= 1) {
      alert("Must have at least 1 possible answer");
      return;
    }
    const newAnswers = question.possibleAnswers.filter((_: any, i: number) => i !== index);
    onChange({ ...question, possibleAnswers: newAnswers });
  };

  return (
    <div className="border p-4 mb-3 bg-light">
      <Form>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0">Fill in the Blank Question</h6>
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
            placeholder="Enter your question with a blank (e.g., 'The capital of France is _____')"
          />
          <Form.Text className="text-muted">
            Use underscores (___) to indicate where students should fill in the blank
          </Form.Text>
        </Form.Group>

        {/* Possible Answers */}
        <Form.Label>Possible Correct Answers:</Form.Label>
        <div className="mb-3">
          {(question.possibleAnswers || [""]).map((answer: string, index: number) => (
            <div key={index} className="d-flex align-items-center mb-2">
              <Form.Control
                type="text"
                value={answer}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                placeholder={`Possible Answer ${index + 1}`}
                className="flex-grow-1"
              />
              {(question.possibleAnswers?.length || 0) > 1 && (
                <Button
                  variant="link"
                  className="text-danger p-1 ms-2"
                  onClick={() => handleRemoveAnswer(index)}
                  title="Remove answer"
                >
                  <BsTrash />
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button variant="link" onClick={handleAddAnswer} className="mb-3 p-0">
          + Add Another Answer
        </Button>

        {/* Case Sensitive */}
        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="Case Sensitive"
            checked={question.caseSensitive || false}
            onChange={(e) => handleFieldChange("caseSensitive", e.target.checked)}
          />
          <Form.Text className="text-muted">
            If checked, answers must match exact capitalization
          </Form.Text>
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
