/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../../store";
import { setQuizzes } from "../reducer";
import * as client from "../../../client";
import { Button, Table } from "react-bootstrap";

export default function QuizDetails() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const isFaculty = (currentUser as any)?.role === "FACULTY";
  const isNew = qid === "new";

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

  if (!quiz && !isNew) {
    return <div>Loading...</div>;
  }

  if (isNew) {
    // Redirect to create new quiz
    return <div>Creating new quiz...</div>;
  }

  return (
    <div className="wd-quiz-details" style={{ maxWidth: "800px" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>{quiz.title}</h2>
        {isFaculty && (
          <div className="d-flex gap-2">
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
              <td>{quiz.timeLimit || 20} Minutes</td>
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
    </div>
  );
}

