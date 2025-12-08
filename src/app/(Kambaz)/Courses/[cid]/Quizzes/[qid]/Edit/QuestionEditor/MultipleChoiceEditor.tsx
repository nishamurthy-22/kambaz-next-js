/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { FaCheck } from "react-icons/fa";
import { BsTrash } from "react-icons/bs";

interface MultipleChoiceEditorProps {
  question: any;
  onCancel: () => void;
  onSave: (updatedQuestion: any) => void;
}

export default function MultipleChoiceEditor({
  question,
  onCancel,
  onSave,
}: MultipleChoiceEditorProps) {
  const [title, setTitle] = useState(question.title || "");
  const [questionText, setQuestionText] = useState(question.question || "");
  const [points, setPoints] = useState(question.points || 1);
  const [choices, setChoices] = useState(
    question.choices && question.choices.length > 0
      ? question.choices
      : ["", "", "", ""]
  );
  const [correctAnswer, setCorrectAnswer] = useState(
    question.correctAnswer || (question.choices?.[question.correctChoice || 0]) || ""
  );

  useEffect(() => {
    setTitle(question.title || "");
    setQuestionText(question.question || "");
    setPoints(question.points || 1);
    setChoices(
      question.choices && question.choices.length > 0
        ? question.choices
        : ["", "", "", ""]
    );
    setCorrectAnswer(
      question.correctAnswer || (question.choices?.[question.correctChoice || 0]) || ""
    );
  }, [question._id]);

  const handleChoiceChange = (index: number, value: string) => {
    const newChoices = [...choices];
    const oldValue = newChoices[index];
    newChoices[index] = value;
    setChoices(newChoices);
    
    if (correctAnswer === oldValue) {
      setCorrectAnswer(value);
    }
  };

  const handleAddChoice = () => {
    setChoices([...choices, ""]);
  };

  const handleRemoveChoice = (index: number) => {
    if (choices.length <= 2) {
      alert("Must have at least 2 choices");
      return;
    }
    
    const removedChoice = choices[index];
    const newChoices = choices.filter((_: any, i: number) => i !== index);
    setChoices(newChoices);
    
    if (correctAnswer === removedChoice) {
      setCorrectAnswer(newChoices[0] || "");
    }
  };

  const handleSaveClick = () => {
    const updatedQuestion = {
      ...question,
      title,
      question: questionText,
      points,
      choices,
      correctAnswer,
      type: "MULTIPLE_CHOICE"
    };
    
    onSave(updatedQuestion);
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
            placeholder="Enter your question..."
          />
        </Form.Group>

        <Form.Label>Answers:</Form.Label>
        <div className="mb-3">
          {choices.map((choice: string, index: number) => (
            <div key={index} className="d-flex align-items-center mb-2">
              <div
                className={`me-2 d-flex align-items-center justify-content-center rounded-circle border ${
                  correctAnswer === choice ? "bg-success text-white border-success" : "bg-white"
                }`}
                style={{ width: "30px", height: "30px", cursor: "pointer" }}
                onClick={() => setCorrectAnswer(choice)}
                title="Click to mark as correct answer"
              >
                {correctAnswer === choice && <FaCheck />}
              </div>
              <Form.Control
                type="text"
                value={choice}
                onChange={(e) => handleChoiceChange(index, e.target.value)}
                placeholder={`Possible Answer ${index + 1}`}
                className="flex-grow-1"
              />
              {choices.length > 2 && (
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
