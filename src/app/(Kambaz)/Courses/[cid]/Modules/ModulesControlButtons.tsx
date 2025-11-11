import { BsPlus } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import LessonControlButtons from "./LessonControlButtons";
import GreenCheckmark from "./GreenCheckmark";
import { IoEllipsisVertical } from "react-icons/io5";
export default function ModulesControlButtons(
  { moduleId, deleteModule, editModule }: { moduleId: string; deleteModule: (moduleId: string) => void; editModule: (moduleId: string) => void } ) {
  return (
    <span className="me-1 position-relative float-end">
      <FaPencil onClick={() => editModule(moduleId)} className="text-primary me-3" />
       <FaTrash className="text-danger me-2 mb-1" onClick={() => deleteModule(moduleId)}/>
        <GreenCheckmark />
      <BsPlus />
      <IoEllipsisVertical className="fs-4" />
      
    </span>);}