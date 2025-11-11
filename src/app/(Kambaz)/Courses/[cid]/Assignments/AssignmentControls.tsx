"use client";
import React from "react";
import { useRouter, useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { InputGroup, FormControl, Button } from "react-bootstrap";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import { FaPlus } from "react-icons/fa6";
import { IoMdSearch } from "react-icons/io";

export default function AssignmentControls() {
  const router = useRouter();
  const { cid } = useParams();
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const isFaculty = currentUser?.role === "FACULTY";

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

      {isFaculty && (
        <div className="d-flex text-nowrap">
          <Button variant="secondary" size="lg" className="me-1">
            <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />{" "}
            Group
          </Button>
          <Button 
            variant="danger" 
            size="lg"
            onClick={() => router.push(`/Courses/${cid}/Assignments/new`)}
          >
            <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />{" "}
            Assignment
          </Button>
        </div>
      )}
    </div>
  );
}
