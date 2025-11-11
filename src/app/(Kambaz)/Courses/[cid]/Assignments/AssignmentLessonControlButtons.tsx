"use client";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";
import GreenCheckmark from "../Modules/GreenCheckmark";

export default function AssignmentLessonControlButtons({ 
  assignmentId, 
  onDeleteClick 
}: { 
  assignmentId: string; 
  onDeleteClick: (assignmentId: string) => void;
}) {
  return (
    <div className="float-end">
      <FaTrash 
        className="text-danger me-2 mb-1" 
        onClick={() => onDeleteClick(assignmentId)}
      />
      <GreenCheckmark />
      <IoEllipsisVertical className="fs-4" />
    </div>
  );
}

