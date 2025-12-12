/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import { setQuizzes, updateQuiz } from "../reducer";
import * as client from "../../../client";
import { Button, Table, Dropdown, Alert } from "react-bootstrap";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaEdit, FaTrash } from "react-icons/fa";
import DeleteConfirmationDialog from "../../Assignments/DeleteConfirmationDialog";

export default function QuizDetails() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const isFaculty = (currentUser as any)?.role === "FACULTY";
  const isNew = qid === "new";

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
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

  const quiz = isNew ? null : (quizzes.find((q: any) => q._id === qid) as any);

  const handleDelete = async () => {
    try {
      await client.deleteQuiz(qid as string);
      setShowDeleteDialog(false);
      router.push(`/Courses/${cid}/Quizzes`);
    } catch (error) {
      alert("Failed to delete quiz");
    }
  };

  const validateQuizForPublish = (quizToValidate: any): string[] => {
    const errors: string[] = [];

    if (!quizToValidate.title || quizToValidate.title.trim() === "") {
      errors.push("Quiz must have a title");
    }

    if (!quizToValidate.questions || quizToValidate.questions.length === 0) {
      errors.push("Quiz must have at least one question");
    }

    quizToValidate.questions?.forEach((q: any, index: number) => {
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
        if (!q.correctAnswer) {
          errors.push(`Question ${index + 1} must have a correct answer selected`);
        }
      }
      if (q.type === "TRUE_FALSE") {
        if (q.correctAnswer === undefined || q.correctAnswer === null) {
          errors.push(`Question ${index + 1} must have a correct answer selected`);
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

    if (!quizToValidate["Available Date"] || quizToValidate["Available Date"].trim() === "") {
      errors.push("'Available From' date is required");
    }

    if (!quizToValidate["Due Date"] || quizToValidate["Due Date"].trim() === "") {
      errors.push("'Due Date' is required");
    }

    if (!quizToValidate["Available Until Date"] || quizToValidate["Available Until Date"].trim() === "") {
      errors.push("'Until' date is required");
    }

    const availableDate = quizToValidate["Available Date"] ? new Date(quizToValidate["Available Date"]) : null;
    const availableUntilDate = quizToValidate["Available Until Date"] ? new Date(quizToValidate["Available Until Date"]) : null;
    const dueDate = quizToValidate["Due Date"] ? new Date(quizToValidate["Due Date"]) : null;

    if (availableDate && availableUntilDate && availableDate >= availableUntilDate) {
      errors.push("'Available From' must be before 'Until' date");
    }

    if (availableDate && dueDate && availableDate > dueDate) {
      errors.push("'Available From' must be before or equal to 'Due' date");
    }

    if (dueDate && availableUntilDate && dueDate > availableUntilDate) {
      errors.push("'Due' date must be before or equal to 'Until' date");
    }

    return errors;
  };

  const handlePublishToggle = async () => {
    setValidationErrors([]);

    if (!quiz.published) {
      const errors = validateQuizForPublish(quiz);
      if (errors.length > 0) {
        setValidationErrors(errors);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    try {
      const updatedQuiz = { ...quiz, published: !quiz.published };
      await client.updateQuiz(updatedQuiz);
      dispatch(updateQuiz(updatedQuiz));
    } catch (error) {
      alert("Failed to update quiz");
    }
  };

  if (!quiz && !isNew) {
    return <div>Loading...</div>;
  }

  if (isNew) {
    return <div>Creating new quiz...</div>;
  }

  return (
    <div className="wd-quiz-details" style={{ maxWidth: "800px" }}>
      {validationErrors.length > 0 && (
        <Alert variant="danger" dismissible onClose={() => setValidationErrors([])}>
          <Alert.Heading>Cannot Publish Quiz</Alert.Heading>
          <p className="mb-2">Please fix the following issues before publishing:</p>
          <ul className="mb-0">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
          <Button 
            variant="primary" 
            size="sm" 
            className="mt-3"
            onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Edit`)}
          >
            Edit Quiz
          </Button>
        </Alert>
      )}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>{quiz.title}</h2>
        {isFaculty && (
          <div className="d-flex gap-2 align-items-center">
            <Button
              variant="secondary"
              onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Preview`)}
            >
              Preview
            </Button>
            <Button
              variant="primary"
              onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Edit`)}
            >
              Edit
            </Button>

            <Dropdown>
              <Dropdown.Toggle
                variant="link"
                className="p-0 text-dark"
                style={{ border: "none", background: "none" }}
                id={`quiz-details-dropdown-${qid}`}
              >
                <IoEllipsisVertical className="fs-4" />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Edit`)}>
                  <FaEdit className="me-2" /> Edit
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setShowDeleteDialog(true)} className="text-danger">
                  <FaTrash className="me-2" /> Delete
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handlePublishToggle}>
                  {quiz.published ? "🚫 Unpublish" : "✅ Publish"}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        )}
        {!isFaculty && (
          <Button
            variant="primary"
            onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Take`)}
          >
            Start Quiz
          </Button>
        )}
      </div>

      <div className="border p-4 mb-4">
        <h5 className="mb-3">Quiz Settings</h5>
        <Table borderless className="mb-0">
          <tbody>
            <tr>
              <td className="fw-semibold" style={{ width: "40%" }}>Quiz Type:</td>
              <td>{quiz.quizType || "Graded Quiz"}</td>
            </tr>
            <tr>
              <td className="fw-semibold">Points:</td>
              <td>{quiz.points || 0}</td>
            </tr>
            <tr>
              <td className="fw-semibold">Assignment Group:</td>
              <td>{quiz.assignmentGroup || "QUIZZES"}</td>
            </tr>
            <tr>
              <td className="fw-semibold">Shuffle Answers:</td>
              <td>{quiz.shuffleAnswers !== false ? "Yes" : "No"}</td>
            </tr>
            <tr>
              <td className="fw-semibold">Time Limit:</td>
              <td>
                {quiz.hasTimeLimit === false 
                  ? "No Time Limit" 
                  : `${quiz.timeLimit || 20} Minutes`}
              </td>
            </tr>
            <tr>
              <td className="fw-semibold">Multiple Attempts:</td>
              <td>{quiz.multipleAttempts ? "Yes" : "No"}</td>
            </tr>
            {quiz.multipleAttempts && (
              <tr>
                <td className="fw-semibold">How Many Attempts:</td>
                <td>{quiz.attemptsAllowed || 1}</td>
              </tr>
            )}
            <tr>
              <td className="fw-semibold">Show Correct Answers:</td>
              <td>{quiz.showCorrectAnswers || "Never"}</td>
            </tr>
            <tr>
              <td className="fw-semibold">Access Code:</td>
              <td>{quiz.accessCode || "(No access code)"}</td>
            </tr>
            <tr>
              <td className="fw-semibold">One Question at a Time:</td>
              <td>{quiz.oneQuestionAtATime !== false ? "Yes" : "No"}</td>
            </tr>
            <tr>
              <td className="fw-semibold">Webcam Required:</td>
              <td>{quiz.webcamRequired ? "Yes" : "No"}</td>
            </tr>
            <tr>
              <td className="fw-semibold">Lock Questions After Answering:</td>
              <td>{quiz.lockQuestionsAfterAnswering ? "Yes" : "No"}</td>
            </tr>
          </tbody>
        </Table>
      </div>

      <div className="border p-4">
        <h5 className="mb-3">Quiz Availability</h5>
        <Table borderless className="mb-0">
          <thead>
            <tr>
              <th>Due</th>
              <th>For</th>
              <th>Available from</th>
              <th>Until</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{quiz["Due Date"] || "No due date"}</td>
              <td>Everyone</td>
              <td>{quiz["Available Date"] || "No start date"}</td>
              <td>{quiz["Available Until Date"] || "No end date"}</td>
            </tr>
          </tbody>
        </Table>
      </div>

      {showDeleteDialog && (
        <DeleteConfirmationDialog
          show={showDeleteDialog}
          handleClose={() => setShowDeleteDialog(false)}
          assignmentTitle={quiz.title}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
