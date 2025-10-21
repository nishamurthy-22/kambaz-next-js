"use client";
import { useRouter, useParams } from "next/navigation";
import * as db from "../../../../Database";
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
  const { assignments } = db;
  const assignment = assignments.find((a) => a._id === aid);

  if (!assignment) {
    return <div className="p-4">Assignment not found.</div>;
  }

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

  return (
    <div
      id="wd-assignments-editor"
      className="container-fluid"
      style={{ maxWidth: "800px", float: "left" }}
    >
      <Form>
        <Form.Group className="mb-3" controlId="wd-name">
          <Form.Label className="fw-semibold">Assignment Name</Form.Label>
          <Form.Control defaultValue={assignment.title} />
        </Form.Group>

        <FormControl
          as="textarea"
          rows={10}
          className="mb-3"
          defaultValue={assignment.description || "Provide details about this assignment here."}
        />

        <Form.Group as={Row} className="mb-3" controlId="wd-points">
          <Form.Label column sm={3} className="text-sm-end">Points</Form.Label>
          <Col sm={9}>
            <Form.Control type="number" defaultValue={assignment.points || 100} />
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
                      defaultValue={formatForInput(assignment["Due"])}
                    />
                  </InputGroup>
                </div>

                <Row>
                  <Col sm={6} className="mb-3">
                    <div className="fw-semibold mb-1">Available from</div>
                    <InputGroup>
                      <Form.Control
                        type="datetime-local"
                        defaultValue={formatForInput(assignment["Not available until"])}
                      />
                    </InputGroup>
                  </Col>

                  <Col sm={6} className="mb-2">
                    <div className="fw-semibold mb-1">Until</div>
                    <InputGroup>
                      <Form.Control
                        type="datetime-local"
                      />
                    </InputGroup>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Form.Group>

        <hr />

        <div className="d-flex justify-content-end gap-2">
          <Button
            id="wd-cancel"
            variant="light"
            onClick={() => router.push(`/Courses/${cid}/Assignments`)}
          >
            Cancel
          </Button>
          <Button id="wd-save" variant="danger"
          onClick={() => router.push(`/Courses/${cid}/Assignments`)}>
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
}
