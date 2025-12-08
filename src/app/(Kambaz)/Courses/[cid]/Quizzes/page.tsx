/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import * as client from "../../client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import { deleteQuiz, setQuizzes, updateQuiz } from "./reducer";
import QuizControls from "./QuizControls";
import { ListGroup, ListGroupItem, Alert, Container } from "react-bootstrap";
import { MdArrowDropDown } from "react-icons/md";
import { BsGripVertical } from "react-icons/bs";
import { FaRocket } from "react-icons/fa";
import QuizControlButtons from "./QuizControlButtons";
import QuizLessonControlButtons from "./QuizLessonControlButtons";
import DeleteConfirmationDialog from "../Assignments/DeleteConfirmationDialog";

export default function Quizzes() {
  const { cid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const isFaculty = (currentUser as any)?.role === "FACULTY";

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchQuizzes = async () => {
    const quizzesData = await client.findQuizzesForCourse(cid as string);
    dispatch(setQuizzes(quizzesData));
  };

  useEffect(() => {
    fetchQuizzes();
  }, [cid]);

  const courseQuizzes = quizzes
    .filter((q: any) => {
      if (q.course !== cid) return false;
      if (isFaculty) return true;
      return q.published === true;
    })
    .filter((q: any) => {
      if (!searchTerm.trim()) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        q.title?.toLowerCase().includes(searchLower) ||
        q.description?.toLowerCase().includes(searchLower)
      );
    })
    .sort((a: any, b: any) => {
      const dateA = a["Available Date"] ? new Date(a["Available Date"]).getTime() : 0;
      const dateB = b["Available Date"] ? new Date(b["Available Date"]).getTime() : 0;
      
      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;
      
      return dateA - dateB;
    }) as any[];

  const handleAddQuiz = async () => {
    const newQuiz = {
      title: "New Quiz",
      description: "",
      points: 0,
      "Available Date": "",
      "Available Until Date": "",
      "Due Date": "",
      "Questions": 0,
      published: false,
      quizType: "Graded Quiz",
      assignmentGroup: "QUIZZES",
      shuffleAnswers: true,
      hasTimeLimit: true,
      timeLimit: 20,
      multipleAttempts: false,
      attemptsAllowed: 1,
      showCorrectAnswers: "Never",
      accessCode: "",
      oneQuestionAtATime: true,
      webcamRequired: false,
      lockQuestionsAfterAnswering: false,
    };
    const createdQuiz = await client.createQuizForCourse(cid as string, newQuiz);
    router.push(`/Courses/${cid}/Quizzes/${createdQuiz._id}`);
  };

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<{ id: string; title: string } | null>(null);

  const handleDeleteClick = (quizId: string) => {
    const quiz = courseQuizzes.find((q: any) => q._id === quizId) as any;
    if (quiz) {
      setQuizToDelete({ id: quizId, title: quiz.title });
      setShowDeleteDialog(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (quizToDelete) {
      try {
        await client.deleteQuiz(quizToDelete.id);
        await fetchQuizzes();
        setQuizToDelete(null);
        setSuccess("Quiz deleted successfully");
        setTimeout(() => setSuccess(""), 3000);
      } catch (error) {
        setError("Failed to delete quiz");
      }
    }
  };

  const handleCloseDialog = () => {
    setShowDeleteDialog(false);
    setQuizToDelete(null);
  };

  const validateQuizForPublish = (quiz: any): string[] => {
    const errors: string[] = [];

    if (!quiz.title || quiz.title.trim() === "") {
      errors.push("Quiz must have a title");
    }

    if (!quiz.questions || quiz.questions.length === 0) {
      errors.push("Quiz must have at least one question");
    }

    quiz.questions?.forEach((q: any, index: number) => {
      if (!q.question || q.question.trim() === "") {
        errors.push(`Question ${index + 1} is missing question text`);
      }
    });

    if (!quiz["Available Date"] || quiz["Available Date"].trim() === "") {
      errors.push("'Available From' date is required");
    }

    if (!quiz["Due Date"] || quiz["Due Date"].trim() === "") {
      errors.push("'Due Date' is required");
    }

    if (!quiz["Available Until Date"] || quiz["Available Until Date"].trim() === "") {
      errors.push("'Until' date is required");
    }

    const availableDate = quiz["Available Date"] ? new Date(quiz["Available Date"]) : null;
    const availableUntilDate = quiz["Available Until Date"] ? new Date(quiz["Available Until Date"]) : null;
    const dueDate = quiz["Due Date"] ? new Date(quiz["Due Date"]) : null;

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

  const handlePublishToggle = async (quiz: any) => {
    setError("");
    setSuccess("");

    if (!quiz.published) {
      const validationErrors = validateQuizForPublish(quiz);
      if (validationErrors.length > 0) {
        setError(
          `Cannot publish "${quiz.title}": ${validationErrors.join("; ")}`
        );
        return;
      }
    }

    try {
      const updatedQuiz = { ...quiz, published: !quiz.published };
      await client.updateQuiz(updatedQuiz);
      dispatch(updateQuiz(updatedQuiz));
      
      setSuccess(
        updatedQuiz.published 
          ? `"${quiz.title}" published successfully` 
          : `"${quiz.title}" unpublished successfully`
      );
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError(`Failed to ${quiz.published ? "unpublish" : "publish"} quiz`);
    }
  };

  const getAvailabilityStatus = (quiz: any) => {
    if (!quiz["Available Date"]) {
      return { status: "Not Set", className: "text-muted" };
    }
    
    const now = new Date();
    const availableDate = new Date(quiz["Available Date"]);
    const availableUntilDate = quiz["Available Until Date"] ? new Date(quiz["Available Until Date"]) : null;

    if (now < availableDate) {
      return { 
        status: `Not available until ${new Date(quiz["Available Date"]).toLocaleDateString()}`, 
        className: "text-muted" 
      };
    }
    if (availableUntilDate && now > availableUntilDate) {
      return { status: "Closed", className: "text-dark" };
    }
    return { status: "Available", className: "text-success" };
  };

  return (
    <Container fluid className="px-4 py-3" style={{ maxWidth: "1400px" }}>
      <QuizControls 
        onAddQuiz={handleAddQuiz}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")} className="mt-3">
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess("")} className="mt-3">
          {success}
        </Alert>
      )}

      <br />
      <br />

      <ListGroup className="rounded-0" id="wd-modules">
        <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-body-tertiary d-flex align-items-center">
            <BsGripVertical className="me-2 fs-3" />
            <MdArrowDropDown className="me-2 fs-3" />
            <span className="fw-semibold">QUIZZES</span>

            <div className="ms-auto d-flex align-items-center gap-2">
              <span className="border rounded-pill px-3 py-1 bg-white text-secondary">
                20% of Total
              </span>
              {isFaculty && <QuizControlButtons />}
            </div>
          </div>

          <ListGroup className="wd-lessons rounded-0">
            {courseQuizzes.length === 0 ? (
              <ListGroupItem className="wd-lesson p-3 ps-1">
                <div className="text-muted text-center">
                  {isFaculty 
                    ? 'No quizzes yet. Click the "+ Quiz" button to create a new quiz.'
                    : 'No quizzes available yet.'}
                </div>
              </ListGroupItem>
            ) : (
              courseQuizzes.map((quiz: any) => {
                const availability = getAvailabilityStatus(quiz);
                return (
                  <ListGroupItem
                    key={quiz._id}
                    className="wd-lesson p-3 ps-1 d-flex align-items-start justify-content-between"
                  >
                    <div className="d-flex align-items-start">
                      <BsGripVertical className="me-3 fs-4 text-secondary" />
                      <FaRocket className="me-3 fs-4 text-success" />
                      <div>
                        <Link
                          href={`/Courses/${cid}/Quizzes/${quiz._id}`}
                          className="wd-quiz-link fw-semibold text-decoration-none text-dark"
                        >
                          {quiz.title}
                        </Link>

                        <div className="text-muted small mt-1">
                          <span className={availability.className}>
                            <span className="fw-semibold">Availability:</span> {availability.status}
                          </span>
                          {quiz["Due Date"] && (
                            <>
                              <span className="ms-1">|</span>
                              <span className="ms-1">
                                <span className="fw-semibold">Due</span> {quiz["Due Date"]}
                              </span>
                            </>
                          )}
                          <span className="ms-1">|</span>
                          <span className="ms-1">{quiz.points || 0} pts</span>
                          <span className="ms-1">|</span>
                          <span className="ms-1">{quiz["Questions"] || 0} Questions</span>
                          {!isFaculty && quiz.score !== undefined && (
                            <>
                              <span className="ms-1">|</span>
                              <span className="ms-1">
                                <span className="fw-semibold">Score:</span> {quiz.score}%
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    {isFaculty && (
                      <QuizLessonControlButtons
                        quizId={quiz._id}
                        onDeleteClick={handleDeleteClick}
                        onPublishToggle={() => handlePublishToggle(quiz)}
                        published={quiz.published || false}
                      />
                    )}
                  </ListGroupItem>
                );
              })
            )}
          </ListGroup>
        </ListGroupItem>
      </ListGroup>

      {quizToDelete && (
        <DeleteConfirmationDialog
          show={showDeleteDialog}
          handleClose={handleCloseDialog}
          assignmentTitle={quizToDelete.title}
          onConfirm={handleConfirmDelete}
        />
      )}
    </Container>
  );
}
