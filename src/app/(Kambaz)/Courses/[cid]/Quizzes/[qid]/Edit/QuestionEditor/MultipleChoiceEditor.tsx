/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Button } from "react-bootstrap";
import { BsTrash } from "react-icons/bs";
import { FaCheck } from "react-icons/fa";

interface MultipleChoiceEditorProps {
  question: any;
  onChange: (question: any) => void;
  onCancel: () => void;
  onSave: () => void;
}

export default function MultipleChoiceEditor({
  question,
  onChange,
  onCancel,
  onSave,
}: MultipleChoiceEditorProps) {
  const handleFieldChange = (field: string, value: any) => {
    onChange({ ...question, [field]: value });
  };

  const handleChoiceChange = (index: number, value: string) => {
    const newChoices = [...(question.choices || ["", "", "", ""])];
    newChoices[index] = value;
    onChange({ ...question, choices: newChoices });
  };

  const handleAddChoice = () => {
    const newChoices = [...(question.choices || []), ""];
    onChange({ ...question, choices: newChoices });
  };

  const handleRemoveChoice = (index: number) => {
    if ((question.choices?.length || 0) <= 2) {
      alert("Must have at least 2 choices");
      return;
    }
    const newChoices = question.choices.filter((_: any, i: number) => i !== index);
    let newCorrectChoice = question.correctChoice;
    if (index === question.correctChoice) {
      newCorrectChoice = 0;
    } else if (index < question.correctChoice) {
      newCorrectChoice = question.correctChoice - 1;
    }
    onChange({ ...question, choices: newChoices, correctChoice: newCorrectChoice });
  };

  const handleSetCorrectChoice = (index: number) => {
    onChange({ ...question, correctChoice: index });
  };

  return (
    <div className="border p-4 mb-3 bg-light">
      <Form>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0">Multiple Choice Question</h6>
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
            placeholder="Enter your question..."
          />
        </Form.Group>

        {/* Choices */}
        <Form.Label>Answers:</Form.Label>
        <div className="mb-3">
          {(question.choices || ["", "", "", ""]).map((choice: string, index: number) => (
            <div key={index} className="d-flex align-items-center mb-2">
              <div
                className={`me-2 d-flex align-items-center justify-content-center rounded-circle border ${
                  question.correctChoice === index ? "bg-success text-white border-success" : "bg-white"
                }`}
                style={{ width: "30px", height: "30px", cursor: "pointer" }}
                onClick={() => handleSetCorrectChoice(index)}
                title="Click to mark as correct answer"
              >
                {question.correctChoice === index && <FaCheck />}
              </div>
              <Form.Control
                type="text"
                value={choice}
                onChange={(e) => handleChoiceChange(index, e.target.value)}
                placeholder={`Possible Answer ${index + 1}`}
                className="flex-grow-1"
              />
              {(question.choices?.length || 0) > 2 && (
                <Button
                  variant="link"
                  className="text-danger p-1 ms-2"
                  onClick={() => handleRemoveChoice(index)}
                  title="Remove choice"
                >
                  <BsTrash />
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button variant="link" onClick={handleAddChoice} className="mb-3 p-0">
          + Add Another Answer
        </Button>

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
