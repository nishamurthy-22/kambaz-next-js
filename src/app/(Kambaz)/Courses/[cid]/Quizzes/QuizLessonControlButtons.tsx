"use client";
import { IoEllipsisVertical, IoBan } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";
import GreenCheckmark from "../Modules/GreenCheckmark";

export default function QuizLessonControlButtons({ 
  quizId, 
  onDeleteClick,
  onPublishToggle,
  published
}: { 
  quizId: string; 
  onDeleteClick: (quizId: string) => void;
  onPublishToggle: (quizId: string) => void;
  published: boolean;
}) {
  return (
    <div className="float-end">
      <button
        className="btn btn-link p-0 me-2"
        onClick={(e) => {
          e.stopPropagation();
          onPublishToggle(quizId);
        }}
        style={{ fontSize: "1.2rem", border: "none", background: "none" }}
      >
        {published ? <GreenCheckmark /> : <IoBan className="text-danger" style={{ fontSize: "1.2rem" }} />}
      </button>
      <FaTrash 
        className="text-danger me-2 mb-1" 
        onClick={(e) => {
          e.stopPropagation();
          onDeleteClick(quizId);
        }}
      />
      <IoEllipsisVertical className="fs-4" />
    </div>
  );
}

