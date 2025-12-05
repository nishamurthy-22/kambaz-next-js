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
import { ListGroup, ListGroupItem } from "react-bootstrap";
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

  const fetchQuizzes = async () => {
    const quizzesData = await client.findQuizzesForCourse(cid as string);
    dispatch(setQuizzes(quizzesData));
  };

  useEffect(() => {
    fetchQuizzes();
  }, [cid]);

  const courseQuizzes = quizzes.filter((q: any) => q.course === cid) as any[];

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
      await client.deleteQuiz(quizToDelete.id);
      await fetchQuizzes();
      setQuizToDelete(null);
    }
  };

  const handleCloseDialog = () => {
    setShowDeleteDialog(false);
    setQuizToDelete(null);
  };

  const handlePublishToggle = async (quiz: any) => {
    const updatedQuiz = { ...quiz, published: !quiz.published };
    await client.updateQuiz(updatedQuiz);
    dispatch(updateQuiz(updatedQuiz));
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
        status: `Not available until ${quiz["Available Date"]}`, 
        className: "text-muted" 
      };
    }
    if (availableUntilDate && now > availableUntilDate) {
      return { status: "Closed", className: "text-dark" };
    }
    return { status: "Available", className: "text-success" };
  };

  return (
    <div>
      <QuizControls onAddQuiz={handleAddQuiz} />
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
                  No quizzes yet. Click the "+ Quiz" button to create a new quiz.
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
    </div>
  );
}
