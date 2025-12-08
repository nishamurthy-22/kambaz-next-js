"use client";
import { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useRouter, useParams } from "next/navigation";

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
  const router = useRouter();
  const { cid } = useParams();

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/Courses/${cid}/Quizzes/${quizId}/Edit`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDeleteClick(quizId);
  };

  const handlePublish = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onPublishToggle(quizId);
  };

  return (
    <div className="d-flex align-items-center gap-2">
      <button
        className="btn btn-link p-0"
        onClick={handlePublish}
        style={{ fontSize: "1.2rem", border: "none", background: "none" }}
        title={published ? "Click to unpublish" : "Click to publish"}
      >
        {published ? "✅" : "🚫"}
      </button>

      <Dropdown onClick={(e) => e.stopPropagation()}>
        <Dropdown.Toggle
          variant="link"
          className="p-0 text-dark"
          style={{ border: "none", background: "none" }}
          id={`dropdown-${quizId}`}
        >
          <IoEllipsisVertical className="fs-4" />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={handleEdit}>
            <FaEdit className="me-2" /> Edit
          </Dropdown.Item>
          <Dropdown.Item onClick={handleDelete} className="text-danger">
            <FaTrash className="me-2" /> Delete
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={handlePublish}>
            {published ? "🚫 Unpublish" : "✅ Publish"}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
