/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Button, Alert, Card } from "react-bootstrap";
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

  const handleAddBlank = () => {
    const newBlanks = [
      ...(question.blanks || []),
      {
        possibleAnswers: [""],
        points: 1,
        caseSensitive: false
      }
    ];
    
    // Calculate total points
    const totalPoints = newBlanks.reduce((sum, blank) => sum + (blank.points || 0), 0);
    
    onChange({ 
      ...question, 
      blanks: newBlanks,
      points: totalPoints 
    });
  };

  const handleRemoveBlank = (blankIndex: number) => {
    if ((question.blanks?.length || 0) <= 1) {
      alert("Must have at least 1 blank");
      return;
    }
    
    const newBlanks = question.blanks.filter((_: any, i: number) => i !== blankIndex);
    const totalPoints = newBlanks.reduce((sum: number, blank: any) => sum + (blank.points || 0), 0);
    
    onChange({ 
      ...question, 
      blanks: newBlanks,
      points: totalPoints 
    });
  };

  const handleBlankPointsChange = (blankIndex: number, points: number) => {
    const newBlanks = [...(question.blanks || [])];
    newBlanks[blankIndex] = { ...newBlanks[blankIndex], points };
    
    const totalPoints = newBlanks.reduce((sum, blank) => sum + (blank.points || 0), 0);
    
    onChange({ 
      ...question, 
      blanks: newBlanks,
      points: totalPoints 
    });
  };

  const handleBlankAnswerChange = (blankIndex: number, answerIndex: number, value: string) => {
    const newBlanks = [...(question.blanks || [])];
    newBlanks[blankIndex].possibleAnswers[answerIndex] = value;
    onChange({ ...question, blanks: newBlanks });
  };

  const handleAddAnswerToBlank = (blankIndex: number) => {
    const newBlanks = [...(question.blanks || [])];
    newBlanks[blankIndex].possibleAnswers.push("");
    onChange({ ...question, blanks: newBlanks });
  };

  const handleRemoveAnswerFromBlank = (blankIndex: number, answerIndex: number) => {
    const newBlanks = [...(question.blanks || [])];
    if (newBlanks[blankIndex].possibleAnswers.length <= 1) {
      alert("Each blank must have at least 1 possible answer");
      return;
    }
    newBlanks[blankIndex].possibleAnswers = newBlanks[blankIndex].possibleAnswers.filter(
      (_: any, i: number) => i !== answerIndex
    );
    onChange({ ...question, blanks: newBlanks });
  };

  const handleBlankCaseSensitiveChange = (blankIndex: number, value: boolean) => {
    const newBlanks = [...(question.blanks || [])];
    newBlanks[blankIndex].caseSensitive = value;
    onChange({ ...question, blanks: newBlanks });
  };

  // Initialize with one blank if none exist
  if (!question.blanks || question.blanks.length === 0) {
    const initialBlanks = [{
      possibleAnswers: [""],
      points: 1,
      caseSensitive: false
    }];
    onChange({ ...question, blanks: initialBlanks, points: 1 });
  }

  return (
    <div className="border p-4 mb-3 bg-light">
      <Form>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0">Fill in the Blank Question</h6>
          <div className="text-muted">
            <strong>Total Points:</strong> {question.points || 0} (auto-calculated)
          </div>
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

        {/* Blanks Configuration */}
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0">Blanks Configuration</h6>
            <Button variant="primary" size="sm" onClick={handleAddBlank}>
              + Add Blank
            </Button>
          </div>

          {(question.blanks || []).map((blank: any, blankIndex: number) => (
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
                    {(question.blanks?.length || 0) > 1 && (
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

                {/* Case Sensitive */}
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
