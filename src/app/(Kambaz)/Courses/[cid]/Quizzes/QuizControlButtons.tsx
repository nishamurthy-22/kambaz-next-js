import { BsPlus } from "react-icons/bs";
import GreenCheckmark from "../Modules/GreenCheckmark";
import { IoEllipsisVertical } from "react-icons/io5";

export default function QuizControlButtons() {
  return (
    <span className="me-1 position-relative float-end">
      <BsPlus />
      <IoEllipsisVertical className="fs-4" />
    </span>
  );
}

