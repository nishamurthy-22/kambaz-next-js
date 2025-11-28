/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import { setAssignments } from "../reducer";
import * as client from "../../../client";
import {
  Button,
  Card,
  Col,
  Form,
  FormControl,
  InputGroup,
  Row,
} from "react-bootstrap";

export default function AssignmentEditor() {
  const { cid, aid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { assignments } = useSelector((state: RootState) => state.assignmentReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const isFaculty = (currentUser as any)?.role === "FACULTY";
  const isNew = aid === "new";
  
  const existingAssignment = isNew ? null : (assignments.find((a: any) => a._id === aid) as any);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState(100);
  const [dueDate, setDueDate] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [availableUntil, setAvailableUntil] = useState("");

  const formatForInput = (dateString: string) => {
    if (!dateString) return "";

    const regex = /(\w+)\s+(\d+)(?:,?\s*(\d{4}))?\s+at\s+(\d+):(\d+)\s*(am|pm)/i;
    const match = dateString.match(regex);
    if (!match) return "";

    const [, monthStr, dayStr, yearStr, hourStr, minStr, ampm] = match;

    const monthNames = [
      "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"
    ];
    const month = monthNames.findIndex(
      (m) => m.toLowerCase() === monthStr.toLowerCase()
    );
    if (month === -1) return "";

    const day = parseInt(dayStr, 10);
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minStr, 10);
    const year = yearStr ? parseInt(yearStr, 10) : new Date().getFullYear();

    if (ampm.toLowerCase() === "pm" && hour !== 12) hour += 12;
    if (ampm.toLowerCase() === "am" && hour === 12) hour = 0;

    const date = new Date(year, month, day, hour, minute);

    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const formatForDisplay = (dateTimeLocal: string) => {
    if (!dateTimeLocal) return "";
    const date = new Date(dateTimeLocal);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    let hour = date.getHours();
    const minute = date.getMinutes();
    const ampm = hour >= 12 ? "pm" : "am";
    hour = hour % 12 || 12;
    const minStr = minute.toString().padStart(2, "0");
    return `${month} ${day}, ${year} at ${hour}:${minStr} ${ampm}`;
  };

  useEffect(() => {
    const fetchAssignments = async () => {
      if (cid) {
        const fetchedAssignments = await client.findAssignmentsForCourse(cid as string);
        dispatch(setAssignments(fetchedAssignments));
      }
    };
    fetchAssignments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cid]);

  useEffect(() => {
    if (existingAssignment) {
      setTitle(existingAssignment.title || "");
      setDescription(existingAssignment.description || "");
      setPoints(existingAssignment.points || 100);
      setDueDate(formatForInput(existingAssignment["Due"] || ""));
      setAvailableFrom(formatForInput(existingAssignment["Not available until"] || ""));
      setAvailableUntil(formatForInput((existingAssignment as any)["Available until"] || ""));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingAssignment]);

  if (!isFaculty && !isNew && !existingAssignment) {
    return <div className="p-4">Assignment not found.</div>;
  }

  const handleSave = async () => {
    if (!isFaculty || !cid) return;
    
    const assignmentData: any = {
      title,
      description,
      points: parseInt(points.toString(), 10),
      course: cid,
      "Due": formatForDisplay(dueDate),
      "Not available until": formatForDisplay(availableFrom),
      "Available until": formatForDisplay(availableUntil),
    };

    if (isNew) {
      await client.createAssignmentForCourse(cid as string, assignmentData);
    } else if (existingAssignment) {
      const updatedAssignment = { ...(existingAssignment as any), ...assignmentData };
      await client.updateAssignment(updatedAssignment);
    }
    
    // Refresh assignments from server to ensure consistency
    if (cid) {
      const fetchedAssignments = await client.findAssignmentsForCourse(cid as string);
      dispatch(setAssignments(fetchedAssignments));
    }
    
    router.push(`/Courses/${cid}/Assignments`);
  };

  const handleCancel = () => {
    router.push(`/Courses/${cid}/Assignments`);
  };

  return (
    <div
      id="wd-assignments-editor"
      className="container-fluid"
      style={{ maxWidth: "800px", float: "left" }}
    >
      <Form>
        <Form.Group className="mb-3" controlId="wd-name">
          <Form.Label className="fw-semibold">Assignment Name</Form.Label>
          <Form.Control 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={!isFaculty}
          />
        </Form.Group>

        <FormControl
          as="textarea"
          rows={10}
          className="mb-3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={!isFaculty}
          placeholder="Provide details about this assignment here."
        />

        <Form.Group as={Row} className="mb-3" controlId="wd-points">
          <Form.Label column sm={3} className="text-sm-end">Points</Form.Label>
          <Col sm={9}>
            <Form.Control 
              type="number" 
              value={points}
              onChange={(e) => setPoints(parseInt(e.target.value, 10) || 100)}
              disabled={!isFaculty}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="wd-group">
          <Form.Label column sm={3} className="text-sm-end">Assignment Group</Form.Label>
          <Col sm={9}>
            <Form.Select defaultValue="ASSIGNMENTS">
              <option>ASSIGNMENTS</option>
              <option>QUIZZES</option>
              <option>EXAMS</option>
              <option>PROJECTS</option>
            </Form.Select>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="wd-display-grade-as">
          <Form.Label column sm={3} className="text-sm-end">Display Grade as</Form.Label>
          <Col sm={9}>
            <Form.Select defaultValue="Percentage">
              <option>Percentage</option>
              <option>Points</option>
              <option>Letter Grade</option>
            </Form.Select>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-2" controlId="wd-submission-type">
          <Form.Label column sm={3} className="text-sm-end">Submission Type</Form.Label>
          <Col sm={9}>
            <Card className="border rounded-3">
              <Card.Body className="p-3">
                <Form.Select defaultValue="Online" className="mb-3">
                  <option>Online</option>
                  <option>On Paper</option>
                  <option>No Submission</option>
                </Form.Select>
                <div className="fw-semibold mb-2">Online Entry Options</div>
                <Form.Check id="wd-text-entry" type="checkbox" label="Text Entry" className="mb-2" />
                <Form.Check id="wd-website-url" type="checkbox" label="Website URL" className="mb-2" defaultChecked />
                <Form.Check id="wd-media-recordings" type="checkbox" label="Media Recordings" className="mb-2" />
                <Form.Check id="wd-student-annotation" type="checkbox" label="Student Annotation" className="mb-2" />
                <Form.Check id="wd-file-upload" type="checkbox" label="File Uploads" />
              </Card.Body>
            </Card>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mt-3" controlId="wd-assign">
          <Form.Label column sm={3} className="text-sm-end">Assign</Form.Label>
          <Col sm={9}>
            <Card className="border">
              <Card.Body className="p-3">
                <div className="mb-3">
                  <div className="fw-semibold mb-1">Assign to</div>
                  <div className="form-control d-flex align-items-center flex-wrap gap-2">
                    <span className="badge text-bg-light px-3 py-2 border">
                      Everyone <span className="ms-2 text-muted" aria-hidden>&times;</span>
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="fw-semibold mb-1">Due</div>
                  <InputGroup>
                    <Form.Control
                      type="datetime-local"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      disabled={!isFaculty}
                    />
                  </InputGroup>
                </div>

                <Row>
                  <Col sm={6} className="mb-3">
                    <div className="fw-semibold mb-1">Available from</div>
                    <InputGroup>
                      <Form.Control
                        type="datetime-local"
                        value={availableFrom}
                        onChange={(e) => setAvailableFrom(e.target.value)}
                        disabled={!isFaculty}
                      />
                    </InputGroup>
                  </Col>

                  <Col sm={6} className="mb-2">
                    <div className="fw-semibold mb-1">Until</div>
                    <InputGroup>
                      <Form.Control
                        type="datetime-local"
                        value={availableUntil}
                        onChange={(e) => setAvailableUntil(e.target.value)}
                        disabled={!isFaculty}
                      />
                    </InputGroup>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Form.Group>

        <hr />

        {isFaculty && (
          <div className="d-flex justify-content-end gap-2">
            <Button
              id="wd-cancel"
              variant="light"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button 
              id="wd-save" 
              variant="danger"
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
}
