/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { InputGroup, FormControl, Button } from "react-bootstrap";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import { FaPlus } from "react-icons/fa6";
import { IoMdSearch } from "react-icons/io";

interface QuizControlsProps {
  onAddQuiz: () => void;
  searchTerm: string;
  onSearchChange: (searchTerm: string) => void;
}

export default function QuizControls({ onAddQuiz, searchTerm, onSearchChange }: QuizControlsProps) {
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const isFaculty = (currentUser as any)?.role === "FACULTY";

  return (
    <div
      id="wd-quiz-controls"
      className="d-flex justify-content-between align-items-center text-nowrap w-100"
    >
      <InputGroup style={{ width: "400px" }}>
        <InputGroupText className="bg-white border-end-0">
          <IoMdSearch />
        </InputGroupText>
        <FormControl
          size="lg"
          placeholder="Search for Quiz"
          className="border-start-0 shadow-none"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </InputGroup>

      {isFaculty && (
        <div className="d-flex text-nowrap">
          <Button 
            variant="danger" 
            size="lg"
            onClick={onAddQuiz}
          >
            <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />{" "}
            Quiz
          </Button>
        </div>
      )}
    </div>
  );
}

