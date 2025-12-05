/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useParams, useRouter } from "next/navigation";
import { Nav, NavItem, NavLink } from "react-bootstrap";

export default function QuizQuestionsEditor() {
  const { cid, qid } = useParams();
  const router = useRouter();

  return (
    <div className="wd-quiz-questions-editor" style={{ maxWidth: "800px" }}>
      <Nav variant="tabs" className="mb-3">
        <NavItem>
          <NavLink
            onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Edit`)}
            style={{ cursor: "pointer" }}
          >
            Details
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active style={{ cursor: "pointer" }}>
            Questions
          </NavLink>
        </NavItem>
      </Nav>

      <div className="p-4">
        <h4>Quiz Questions Editor</h4>
        <p className="text-muted">Questions editor will be implemented here.</p>
      </div>
    </div>
  );
}

