import { BsPlus } from "react-icons/bs";
import LessonControlButtons from "./LessonControlButtons";
import GreenCheckmark from "./GreenCheckmark";
import { IoEllipsisVertical } from "react-icons/io5";
export default function ModulesControlButtons() {
  return (
    <span className="me-1 position-relative float-end">
        <GreenCheckmark />
      <BsPlus />
      <IoEllipsisVertical className="fs-4" />
      
    </span>);}