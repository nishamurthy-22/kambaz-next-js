"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import { deleteAssignment } from "./reducer";
import AssignmentControls from "./AssignmentControls";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { MdArrowDropDown } from "react-icons/md";
import { BsGripVertical } from "react-icons/bs";
import { LuNotebookPen } from "react-icons/lu";
import AssignmentControlButtons from "./AssignmentControlButtons";
import AssignmentLessonControlButtons from "./AssignmentLessonControlButtons";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

export default function Assignments() {
  const { cid } = useParams();
  const dispatch = useDispatch();
  const { assignments } = useSelector((state: RootState) => state.assignmentReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const isFaculty = (currentUser as any)?.role === "FACULTY";

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<{ id: string; title: string } | null>(null);

  const courseAssignments = assignments.filter((a: any) => a.course === cid);

  const handleDeleteClick = (assignmentId: string) => {
    const assignment = courseAssignments.find((a: any) => a._id === assignmentId);
    if (assignment) {
      setAssignmentToDelete({ id: assignmentId, title: assignment.title });
      setShowDeleteDialog(true);
    }
  };

  const handleConfirmDelete = () => {
    if (assignmentToDelete) {
      dispatch(deleteAssignment(assignmentToDelete.id));
      setAssignmentToDelete(null);
    }
  };

  const handleCloseDialog = () => {
    setShowDeleteDialog(false);
    setAssignmentToDelete(null);
  };

  return (
    <div>
      <AssignmentControls />
      <br />
      <br />

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
              {isFaculty && <AssignmentControlButtons />}
            </div>
          </div>

          <ListGroup className="wd-lessons rounded-0">
            {courseAssignments.map((assignment) => (
              <ListGroupItem
                key={assignment._id}
                className="wd-lesson p-3 ps-1 d-flex align-items-start justify-content-between"
              >
                <div className="d-flex align-items-start">
                  <BsGripVertical className="me-3 fs-4 text-secondary" />
                  <LuNotebookPen className="me-3 fs-4 text-success" />
                  <div>
                    <Link
                      href={`/Courses/${cid}/Assignments/${assignment._id}`}
                      className="wd-assignment-link fw-semibold text-decoration-none text-dark"
                    >
                      {assignment.title}
                    </Link>

                    <div className="text-muted small mt-1">
                      <span className="text-danger">Multiple Modules</span> |{" "}
                      {assignment["Not available until"] && (
                        <>
                          <span className="ms-1">
                            <span className="fw-semibold">Not available until</span>{" "}
                            {assignment["Not available until"]} |{" "}
                          </span>
                        </>
                      )}
                      {assignment["Due"] && (
                        <>
                          <span className="ms-1">
                            <span className="fw-semibold">Due</span>{" "}
                            {assignment["Due"]} |{" "}
                          </span>
                        </>
                      )}
                      <span className="ms-1">{assignment["points"]} pts</span>
                    </div>
                  </div>
                </div>
                {isFaculty && (
                  <AssignmentLessonControlButtons
                    assignmentId={assignment._id}
                    onDeleteClick={handleDeleteClick}
                  />
                )}
              </ListGroupItem>
            ))}
          </ListGroup>
        </ListGroupItem>

                  <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-body-tertiary d-flex align-items-center">
            <BsGripVertical className="me-2 fs-3" />
            <MdArrowDropDown className="me-2 fs-3" />
            <span className="fw-semibold">QUIZZES</span>

            <div className="ms-auto d-flex align-items-center gap-2">
              <span className="border rounded-pill px-3 py-1 bg-white text-secondary">
                20% of Total
              </span>
              {isFaculty && <AssignmentControlButtons />}
            </div>
          </div>
          </ListGroupItem>
                  <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-body-tertiary d-flex align-items-center">
            <BsGripVertical className="me-2 fs-3" />
            <MdArrowDropDown className="me-2 fs-3" />
            <span className="fw-semibold">PROJECTS</span>

            <div className="ms-auto d-flex align-items-center gap-2">
              <span className="border rounded-pill px-3 py-1 bg-white text-secondary">
                20% of Total
              </span>
              {isFaculty && <AssignmentControlButtons />}
            </div>
          </div>
          </ListGroupItem>

                            <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-body-tertiary d-flex align-items-center">
            <BsGripVertical className="me-2 fs-3" />
            <MdArrowDropDown className="me-2 fs-3" />
            <span className="fw-semibold">EXAMS</span>

            <div className="ms-auto d-flex align-items-center gap-2">
              <span className="border rounded-pill px-3 py-1 bg-white text-secondary">
                20% of Total
              </span>
              {isFaculty && <AssignmentControlButtons />}
            </div>
          </div>
          </ListGroupItem>
      </ListGroup>

      {assignmentToDelete && (
        <DeleteConfirmationDialog
          show={showDeleteDialog}
          handleClose={handleCloseDialog}
          assignmentTitle={assignmentToDelete.title}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
