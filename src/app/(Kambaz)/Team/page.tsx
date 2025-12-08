"use client";
import { Card, CardBody, CardTitle } from "react-bootstrap";
import Link from "next/link";

export default function Team() {
  return (
    <div id="wd-team-page" style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1>Team Information</h1>
      <hr />
      
      <Card className="mb-4">
        <CardBody>
          <CardTitle as="h3">Team Members</CardTitle>
          <ul style={{ fontSize: "1.1rem", lineHeight: "2" }}>
            <li>Chandan Gowda Keelara Shivanna</li>
            <li>Nikhil Kundalli Harish</li>
            <li>Nisha Murthy Dinesh</li>
          </ul>
          <p style={{ fontSize: "1.1rem", marginTop: "15px" }}>
            <strong>Section:</strong> CS 5610 Fall 2025
          </p>
        </CardBody>
      </Card>

      <Card className="mb-4">
        <CardBody>
          <CardTitle as="h3">Repository Links</CardTitle>
          <div style={{ fontSize: "1.1rem", lineHeight: "2.5" }}>
            <div>
              <strong>Frontend Repository:</strong>
              <br />
              <Link 
                href="https://github.com/nishamurthy-22/kambaz-next-js/tree/feature/final" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ wordBreak: "break-all" }}
              >
                https://github.com/nishamurthy-22/kambaz-next-js/tree/feature/final
              </Link>
            </div>
            <div style={{ marginTop: "15px" }}>
              <strong>Backend Repository:</strong>
              <br />
              <Link 
                href="https://github.com/nishamurthy-22/kambaz-node-server-app/tree/feature/final" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ wordBreak: "break-all" }}
              >
                https://github.com/nishamurthy-22/kambaz-node-server-app/tree/feature/final
              </Link>
            </div>
          </div>
        </CardBody>
      </Card>

      <div style={{ marginTop: "30px" }}>
        <Link href="/Account/Signin" className="btn btn-primary">
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}

