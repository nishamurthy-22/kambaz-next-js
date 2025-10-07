import Link from "next/link";
import AssignmentControls from "./AssignmentControls";
import { Button, ListGroup, ListGroupItem } from "react-bootstrap";
import { MdArrowDropDown } from "react-icons/md";
import { BsGripVertical } from "react-icons/bs";
import AssignmentControlButtons from "./AssignmentControlButtons";
import LessonControlButtons from "./LessonControlButtons";
import { LuNotebookPen } from "react-icons/lu";
export default function Assignments() {
  return (
    <div>
   <AssignmentControls /><br /><br />
    
  <ListGroup className="rounded-0" id="wd-modules">
    <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
      <div className="wd-title p-3 ps-2 bg-body-tertiary d-flex align-items-center">
      <BsGripVertical className="me-2 fs-3" />
      <MdArrowDropDown className="me-2 fs-3" />
      <span className="fw-semibold">ASSIGNMENTS</span>
      <div className="ms-auto d-flex align-items-center gap-2">
<span className="border rounded-pill px-3 py-1 bg-white text-secondary">
  40% of Total
</span>
        <AssignmentControlButtons />
      </div>
    </div>
    <ListGroup className="wd-lessons rounded-0">
      <ListGroupItem className="wd-lesson p-3 ps-1 d-flex align-items-start justify-content-between">
        <div className="d-flex align-items-start">
          <BsGripVertical className="me-3 fs-4 text-secondary" />
          <LuNotebookPen className="me-3 fs-4 text-success" />
          <div>
            <Link
              href="/Courses/1234/Assignments/123"
              className="wd-assignment-link fw-semibold text-decoration-none text-dark"
            >
              A1 - ENV + HTML
            </Link>
            <div className="text-muted small mt-1">
              <span className="text-danger">Multiple Modules</span> |
          <span className="ms-1">
  <span className="fw-semibold">Not available until</span> May 6 at 12:00 am
</span>
|
<span className="ms-1">
  <span className="fw-semibold">Due</span> May 13 at 11:59 pm |
</span>
              <span className="ms-1">100 pts</span>
            </div>
          </div>
        </div>
        <LessonControlButtons />
              </ListGroupItem>
    </ListGroup>


    <ListGroup className="wd-lessons rounded-0">
      <ListGroupItem className="wd-lesson p-3 ps-1 d-flex align-items-start justify-content-between">
        <div className="d-flex align-items-start">
          <BsGripVertical className="me-3 fs-4 text-secondary" />
          <LuNotebookPen className="me-3 fs-4 text-success" />
          <div>
            <Link
              href="/Courses/1234/Assignments/124"
              className="wd-assignment-link fw-semibold text-decoration-none text-dark"
            >
              A2 - CSS + BOOTSTRAP
            </Link>
            <div className="text-muted small mt-1">
              <span className="text-danger">Multiple Modules</span> |
          <span className="ms-1">
  <span className="fw-semibold">Not available until</span> May 13 at 12:00 am
</span>
|
<span className="ms-1">
  <span className="fw-semibold">Due</span> May 20 at 11:59 pm |
</span>
              <span className="ms-1">100 pts</span>
            </div>
          </div>
        </div>
        <LessonControlButtons />
              </ListGroupItem>
    </ListGroup>

    <ListGroup className="wd-lessons rounded-0">
      <ListGroupItem className="wd-lesson p-3 ps-1 d-flex align-items-start justify-content-between">
        <div className="d-flex align-items-start">
          <BsGripVertical className="me-3 fs-4 text-secondary" />
          <LuNotebookPen className="me-3 fs-4 text-success" />
          <div>
            <Link
              href="/Courses/1234/Assignments/125"
              className="wd-assignment-link fw-semibold text-decoration-none text-dark"
            >
              A3 - JAVASCRIPT + REACT
            </Link>
            <div className="text-muted small mt-1">
              <span className="text-danger">Multiple Modules</span> |
          <span className="ms-1">
  <span className="fw-semibold">Not available until</span> May 20 at 12:00 am
</span>
| 
<span className="ms-1">
  <span className="fw-semibold">Due</span> May 27 at 11:59 pm |
</span>
              <span className="ms-1">100 pts</span>
            </div>
          </div>
        </div>
        <LessonControlButtons />
              </ListGroupItem>
    </ListGroup>
    </ListGroupItem>
  </ListGroup>

    <ListGroup className="rounded-0" id="wd-modules">
    <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
      <div className="wd-title p-3 ps-2 bg-body-tertiary d-flex align-items-center">
      <BsGripVertical className="me-2 fs-3" />
      <MdArrowDropDown className="me-2 fs-3" />
      <span className="fw-semibold">Quizzes</span>

      <div className="ms-auto d-flex align-items-center gap-2">
<span className="border rounded-pill px-3 py-1 bg-white text-secondary">
  20% of Total
</span>
        <AssignmentControlButtons />
      </div>
    </div>
    <ListGroup className="wd-lessons rounded-0">
      <ListGroupItem className="wd-lesson p-3 ps-1 d-flex align-items-start justify-content-between">
        <div className="d-flex align-items-start">
          <BsGripVertical className="me-3 fs-4 text-secondary" />
          <LuNotebookPen className="me-3 fs-4 text-success" />
          <div>
              Quiz 1
          </div>
        </div>
        <LessonControlButtons />
              </ListGroupItem>
    </ListGroup>
    </ListGroupItem>
  </ListGroup>

      <ListGroup className="rounded-0" id="wd-modules">
    <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
      <div className="wd-title p-3 ps-2 bg-body-tertiary d-flex align-items-center">
      <BsGripVertical className="me-2 fs-3" />
      <MdArrowDropDown className="me-2 fs-3" />
      <span className="fw-semibold">EXAMS</span>

      <div className="ms-auto d-flex align-items-center gap-2">
<span className="border rounded-pill px-3 py-1 bg-white text-secondary">
  20% of Total
</span>
        <AssignmentControlButtons />
      </div>
    </div>
    <ListGroup className="wd-lessons rounded-0">
      <ListGroupItem className="wd-lesson p-3 ps-1 d-flex align-items-start justify-content-between">
        <div className="d-flex align-items-start">
          <BsGripVertical className="me-3 fs-4 text-secondary" />
          <LuNotebookPen className="me-3 fs-4 text-success" />
          <div>
              Midterm Exam
          </div>
        </div>
        <LessonControlButtons />
              </ListGroupItem>
    </ListGroup>
    </ListGroupItem>
  </ListGroup>

      <ListGroup className="rounded-0" id="wd-modules">
    <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
      <div className="wd-title p-3 ps-2 bg-body-tertiary d-flex align-items-center">
      <BsGripVertical className="me-2 fs-3" />
      <MdArrowDropDown className="me-2 fs-3" />
      <span className="fw-semibold">PROJECTS</span>

      <div className="ms-auto d-flex align-items-center gap-2">
<span className="border rounded-pill px-3 py-1 bg-white text-secondary">
  20% of Total
</span>
        <AssignmentControlButtons />
      </div>
    </div>
    <ListGroup className="wd-lessons rounded-0">
      <ListGroupItem className="wd-lesson p-3 ps-1 d-flex align-items-start justify-content-between">
        <div className="d-flex align-items-start">
          <BsGripVertical className="me-3 fs-4 text-secondary" />
          <LuNotebookPen className="me-3 fs-4 text-success" />
          <div>
             Final Project
          </div>
        </div>
        <LessonControlButtons />
              </ListGroupItem>
    </ListGroup>
    </ListGroupItem>
  </ListGroup>

    </div>
);}
