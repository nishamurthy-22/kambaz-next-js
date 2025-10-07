"use client";
import Link from "next/link";
import {
  Button,
  Card,
  Col,
  Form,
  FormControl,
  InputGroup,
  Row
} from "react-bootstrap";
import { BsCalendar3 } from "react-icons/bs";

export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor" className="container-fluid" style={{maxWidth:"800px",  float: "left"}}>
      <Form>
        <Form.Group className="mb-3" controlId="wd-name">
          <Form.Label className="fw-semibold">Assignment Name</Form.Label>
          <Form.Control defaultValue="A1" />
        </Form.Group>

<FormControl
        as="textarea"
        rows={12}
        className="mb-3"
        defaultValue={
          "The assignment is available online. Submit a link to the landing page of your Web application running on Netlify. The landing page should include the following: Your full name and section, links to each of the lab assignments, links to the Kambaz application, links to all relevant source code repositories. The Kambaz application should include a link to navigate back to the landing page."
        }
      ></FormControl>

        <Form.Group as={Row} className="mb-3" controlId="wd-points">
          <Form.Label column sm={3} className="text-sm-end">Points</Form.Label>
          <Col sm={9}>
            <Form.Control type="number" defaultValue={100} />
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
              type="date"
              defaultValue="2024-05-13"
              aria-label="Due date"
            />
          </InputGroup>
        </div>

        <Row>
          <Col sm={6} className="mb-3">
            <div className="fw-semibold mb-1">Available from</div>
            <InputGroup>
              <Form.Control
                type="date"
                defaultValue="2024-05-06"
                aria-label="Available from"
              />
            </InputGroup>
          </Col>
          <Col sm={6} className="mb-2">
            <div className="fw-semibold mb-1">Until</div>
            <InputGroup>
              <Form.Control
                type="date"
                defaultValue="2024-05-20"
                aria-label="Until"
              />
            </InputGroup>
          </Col>
        </Row>

      </Card.Body>
    </Card>
  </Col>
</Form.Group>
<hr></hr>
        <div className="d-flex justify-content-end gap-2">
          <Button id="wd-cancel" variant="light">Cancel</Button>
          <Button id="wd-save" type="submit" variant="danger">Save</Button>
        </div>
      </Form>
    </div>
  );
}
