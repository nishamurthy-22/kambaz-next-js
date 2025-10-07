import React from "react";
import { InputGroup, FormControl, Button } from "react-bootstrap";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import { FaPlus } from "react-icons/fa6";
import { IoMdSearch } from "react-icons/io";

export default function AssignmentControls() {
  return (
    <div
      id="wd-assignment-controls"
      className="d-flex justify-content-between align-items-center text-nowrap w-100"
    >
      <InputGroup style={{ width: "400px" }}>
        <InputGroupText className="bg-white border-end-0">
          <IoMdSearch />
        </InputGroupText>
        <FormControl
        size = "lg"
          placeholder="Search..."
          className="border-start-0 shadow-none"
        />
      </InputGroup>

      <div className="d-flex text-nowrap">
        <Button variant="secondary" size="lg" className="me-1">
          <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />{" "}
          Group
        </Button>
        <Button variant="danger" size="lg">
          <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />{" "}
          Assignment
        </Button>
      </div>
    </div>
  );
}
