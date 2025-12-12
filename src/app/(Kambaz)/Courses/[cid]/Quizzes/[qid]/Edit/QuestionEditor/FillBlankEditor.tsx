/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Form, Button, Alert, Card } from "react-bootstrap";
import { BsTrash } from "react-icons/bs";

interface FillBlankEditorProps {
  question: any;
  onCancel: () => void;
  onSave: (updatedQuestion: any) => void;
}

export default function FillBlankEditor({
  question,
  onCancel,
  onSave,
}: FillBlankEditorProps) {
  const [title, setTitle] = useState(question.title || "");
  const [questionText, setQuestionText] = useState(question.question || "");
  const [blanks, setBlanks] = useState(
    question.blanks && question.blanks.length > 0
      ? question.blanks
      : [{
          possibleAnswers: [""],
          points: 1,
          caseSensitive: false
        }]
  );

  useEffect(() => {
    setTitle(question.title || "");
    setQuestionText(question.question || "");
    setBlanks(
      question.blanks && question.blanks.length > 0
        ? question.blanks
        : [{
            possibleAnswers: [""],
            points: 1,
            caseSensitive: false
          }]
    );
  }, [question._id]);

  const totalPoints = blanks.reduce((sum: number, blank: any) => sum + (blank.points || 0), 0);

  const handleAddBlank = () => {
    setBlanks([
      ...blanks,
      {
        possibleAnswers: [""],
        points: 1,
        caseSensitive: false
      }
    ]);
  };

  const handleRemoveBlank = (blankIndex: number) => {
    if (blanks.length <= 1) {
      alert("Must have at least 1 blank");
      return;
    }
    setBlanks(blanks.filter((_: any, i: number) => i !== blankIndex));
  };

  const handleBlankPointsChange = (blankIndex: number, points: number) => {
    const newBlanks = [...blanks];
    newBlanks[blankIndex] = { ...newBlanks[blankIndex], points };
    setBlanks(newBlanks);
  };

  const handleBlankAnswerChange = (blankIndex: number, answerIndex: number, value: string) => {
    const newBlanks = [...blanks];
    const updatedBlank = { ...newBlanks[blankIndex] };
    const updatedAnswers = [...(updatedBlank.possibleAnswers || [])];
    updatedAnswers[answerIndex] = value;
    updatedBlank.possibleAnswers = updatedAnswers;
    newBlanks[blankIndex] = updatedBlank;
    setBlanks(newBlanks);
  };

  const handleAddAnswerToBlank = (blankIndex: number) => {
    const newBlanks = [...blanks];
    const updatedBlank = { ...newBlanks[blankIndex] };
    updatedBlank.possibleAnswers = [...(updatedBlank.possibleAnswers || []), ""];
    newBlanks[blankIndex] = updatedBlank;
    setBlanks(newBlanks);
  };

  const handleRemoveAnswerFromBlank = (blankIndex: number, answerIndex: number) => {
    const newBlanks = [...blanks];
    const updatedBlank = { ...newBlanks[blankIndex] };
    
    if ((updatedBlank.possibleAnswers?.length || 0) <= 1) {
      alert("Each blank must have at least 1 possible answer");
      return;
    }
    
    updatedBlank.possibleAnswers = updatedBlank.possibleAnswers.filter(
      (_: any, i: number) => i !== answerIndex
    );
    newBlanks[blankIndex] = updatedBlank;
    setBlanks(newBlanks);
  };

  const handleBlankCaseSensitiveChange = (blankIndex: number, value: boolean) => {
    const newBlanks = [...blanks];
    newBlanks[blankIndex] = { ...newBlanks[blankIndex], caseSensitive: value };
    setBlanks(newBlanks);
  };

  const handleSaveClick = () => {
    const updatedQuestion = {
      ...question,
      title,
      question: questionText,
      blanks,
      points: totalPoints,
      type: "FILL_BLANK"
    };
    
    onSave(updatedQuestion);
  };

  return (
    <div className="border p-4 mb-3 bg-light">
      <Form>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0">Fill in the Blank Question</h6>
          <div className="text-muted">
            <strong>Total Points:</strong> {totalPoints} (auto-calculated)
          </div>
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
            placeholder="Enter your question with numbered blanks (e.g., 'The capital of __1__ is __2__')"
          />
          <Form.Text className="text-muted">
            Use __1__, __2__, __3__, etc. to indicate blanks. Students will fill in each blank separately.
          </Form.Text>
        </Form.Group>

        <Alert variant="info" className="py-2 mb-3">
          <small>
            <strong>Note:</strong> Each blank can have different points and multiple possible correct answers.
            Total points are calculated automatically.
          </small>
        </Alert>

        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0">Blanks Configuration</h6>
            <Button variant="primary" size="sm" onClick={handleAddBlank}>
              + Add Blank
            </Button>
          </div>

          {blanks.map((blank: any, blankIndex: number) => (
            <Card key={blankIndex} className="mb-3">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0 text-primary">Blank {blankIndex + 1}</h6>
                  <div className="d-flex align-items-center gap-2">
                    <Form.Label className="mb-0 me-2">
                      <strong>Points:</strong>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      value={blank.points || 1}
                      onChange={(e) => handleBlankPointsChange(blankIndex, parseInt(e.target.value) || 0)}
                      min="0"
                      style={{ width: "80px" }}
                    />
                    {blanks.length > 1 && (
                      <Button
                        variant="link"
                        className="text-danger p-0"
                        onClick={() => handleRemoveBlank(blankIndex)}
                        title="Remove blank"
                      >
                        <BsTrash />
                      </Button>
                    )}
                  </div>
                </div>

                <Form.Label className="fw-bold">Possible Correct Answers:</Form.Label>
                {(blank.possibleAnswers || [""]).map((answer: string, answerIndex: number) => (
                  <div key={answerIndex} className="d-flex align-items-center mb-2">
                    <Form.Control
                      type="text"
                      value={answer}
                      onChange={(e) => handleBlankAnswerChange(blankIndex, answerIndex, e.target.value)}
                      placeholder={`Answer ${answerIndex + 1}`}
                      className="flex-grow-1"
                    />
                    {(blank.possibleAnswers?.length || 0) > 1 && (
                      <Button
                        variant="link"
                        className="text-danger p-1 ms-2"
                        onClick={() => handleRemoveAnswerFromBlank(blankIndex, answerIndex)}
                        title="Remove answer"
                      >
                        <BsTrash />
                      </Button>
                    )}
                  </div>
                ))}

                <Button
                  variant="link"
                  onClick={() => handleAddAnswerToBlank(blankIndex)}
                  className="p-0 mb-2"
                  size="sm"
                >
                  + Add Another Answer
                </Button>

                <Form.Group className="mb-0 mt-2">
                  <Form.Check
                    type="checkbox"
                    label="Case Sensitive"
                    checked={blank.caseSensitive || false}
                    onChange={(e) => handleBlankCaseSensitiveChange(blankIndex, e.target.checked)}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          ))}
        </div>

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
