/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button, Form, ListGroup, InputGroup, FormControl } from "react-bootstrap";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import { v4 as uuidv4 } from "uuid";
import { BsTrash, BsPencil } from "react-icons/bs";
import { IoMdSearch } from "react-icons/io";
import MultipleChoiceEditor from "./QuestionEditor/MultipleChoiceEditor";
import TrueFalseEditor from "./QuestionEditor/TrueFalseEditor";
import FillBlankEditor from "./QuestionEditor/FillBlankEditor";

interface QuestionsTabProps {
  questions: any[];
  onQuestionsChange: (questions: any[]) => void;
}

export default function QuestionsTab({ questions, onQuestionsChange }: QuestionsTabProps) {
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddQuestion = () => {
    const newQuestion = {
      _id: uuidv4(),
      type: "MULTIPLE_CHOICE",
      title: "",
      points: 1,
      question: "",
      choices: ["", "", "", ""],
      correctChoice: 0,
    };
    onQuestionsChange([...questions, newQuestion]);
    setEditingQuestionId(newQuestion._id);
    setEditingQuestion(newQuestion);
  };

  const handleEditQuestion = (question: any) => {
    setEditingQuestionId(question._id);
    setEditingQuestion({ ...question });
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      const updatedQuestions = questions.filter((q) => q._id !== questionId);
      onQuestionsChange(updatedQuestions);
    }
  };

  const handleSaveQuestion = (updatedQuestion: any) => {
    const updatedQuestions = questions.map((q) =>
      q._id === updatedQuestion._id ? updatedQuestion : q
    );
    
    onQuestionsChange(updatedQuestions);
    setEditingQuestionId(null);
    setEditingQuestion(null);
  };

  const handleCancelEdit = () => {
    if (editingQuestion && !questions.find(q => q._id === editingQuestion._id && q.question)) {
      const updatedQuestions = questions.filter((q) => q._id !== editingQuestion._id);
      onQuestionsChange(updatedQuestions);
    }
    setEditingQuestionId(null);
    setEditingQuestion(null);
  };

  const handleQuestionTypeChange = (type: string) => {
    if (!editingQuestion) return;

    let updatedQuestion = { ...editingQuestion, type };

    if (type === "MULTIPLE_CHOICE") {
      updatedQuestion = {
        ...updatedQuestion,
        choices: ["", "", "", ""],
        correctChoice: 0,
        correctAnswer: undefined,
        blanks: undefined,
        possibleAnswers: undefined,
        caseSensitive: undefined,
      };
    } else if (type === "TRUE_FALSE") {
      updatedQuestion = {
        ...updatedQuestion,
        correctAnswer: true,
        choices: undefined,
        correctChoice: undefined,
        blanks: undefined,
        possibleAnswers: undefined,
        caseSensitive: undefined,
      };
    } else if (type === "FILL_BLANK") {
      updatedQuestion = {
        ...updatedQuestion,
        blanks: [{
          possibleAnswers: [""],
          points: 1,
          caseSensitive: false
        }],
        points: 1,
        choices: undefined,
        correctChoice: undefined,
        correctAnswer: undefined,
        possibleAnswers: undefined,
        caseSensitive: undefined,
      };
    }

    setEditingQuestion(updatedQuestion);
  };

  const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);

  const filteredQuestions = questions.filter((q: any) => {
    if (!searchTerm.trim()) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      q.title?.toLowerCase().includes(searchLower) ||
      q.question?.toLowerCase().includes(searchLower)
    );
  });

  const renderQuestionPreview = (question: any) => {
    return (
      <div>
        <div className="d-flex justify-content-between align-items-start">
          <div className="flex-grow-1">
            <strong>{question.title || "Untitled Question"}</strong>
            <div className="text-muted small">{question.question || "No question text"}</div>
            <div className="text-muted small mt-1">
              <span className="badge bg-secondary me-2">
                {question.type === "MULTIPLE_CHOICE" && "Multiple Choice"}
                {question.type === "TRUE_FALSE" && "True/False"}
                {question.type === "FILL_BLANK" && "Fill in Blank"}
              </span>
              <span>{question.points || 0} pts</span>
              {question.type === "FILL_BLANK" && question.blanks && (
                <span className="ms-2">({question.blanks.length} blank{question.blanks.length !== 1 ? 's' : ''})</span>
              )}
            </div>
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="link"
              size="sm"
              className="p-1 text-primary"
              onClick={() => handleEditQuestion(question)}
            >
              <BsPencil />
            </Button>
            <Button
              variant="link"
              size="sm"
              className="p-1 text-danger"
              onClick={() => handleDeleteQuestion(question._id)}
            >
              <BsTrash />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderQuestionEditor = () => {
    if (!editingQuestion) return null;

    const commonProps = {
      question: editingQuestion,
      onCancel: handleCancelEdit,
      onSave: handleSaveQuestion,
    };

    return (
      <div className="mb-4">
        <Form.Group className="mb-3">
          <Form.Label>Question Type</Form.Label>
          <Form.Select
            value={editingQuestion.type}
            onChange={(e) => handleQuestionTypeChange(e.target.value)}
          >
            <option value="MULTIPLE_CHOICE">Multiple Choice</option>
            <option value="TRUE_FALSE">True/False</option>
            <option value="FILL_BLANK">Fill in the Blank</option>
          </Form.Select>
        </Form.Group>

        {editingQuestion.type === "MULTIPLE_CHOICE" && (
          <MultipleChoiceEditor {...commonProps} />
        )}
        {editingQuestion.type === "TRUE_FALSE" && <TrueFalseEditor {...commonProps} />}
        {editingQuestion.type === "FILL_BLANK" && <FillBlankEditor {...commonProps} />}
      </div>
    );
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5>Questions</h5>
        <div>
          <span className="me-3">
            <strong>Total Points:</strong> {totalPoints}
          </span>
          <Button variant="primary" onClick={handleAddQuestion}>
            + New Question
          </Button>
        </div>
      </div>

      {questions.length > 0 && (
        <div className="mb-3">
          <InputGroup style={{ maxWidth: "400px" }}>
            <InputGroupText className="bg-white border-end-0">
              <IoMdSearch />
            </InputGroupText>
            <FormControl
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-start-0 shadow-none"
            />
          </InputGroup>
          {searchTerm && (
            <div className="mt-2 text-muted small">
              Showing {filteredQuestions.length} of {questions.length} questions
            </div>
          )}
        </div>
      )}

      {editingQuestionId && renderQuestionEditor()}

      {questions.length === 0 ? (
        <div className="text-center text-muted py-5 border rounded">
          <h6>No questions yet</h6>
          <p>Click &quot;+ New Question&quot; to add your first question</p>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="text-center text-muted py-5 border rounded">
          <h6>No questions match your search</h6>
          <p>Try a different search term</p>
        </div>
      ) : (
        <ListGroup>
          {filteredQuestions.map((question) => {
            const originalIndex = questions.findIndex((q: any) => q._id === question._id);
            return (
              <ListGroup.Item
                key={question._id}
                className={editingQuestionId === question._id ? "d-none" : ""}
              >
                <div className="d-flex align-items-start">
                  <div className="me-3 text-muted">
                    <strong>Q{originalIndex + 1}</strong>
                  </div>
                  <div className="flex-grow-1">{renderQuestionPreview(question)}</div>
                </div>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      )}
    </div>
  );
}
