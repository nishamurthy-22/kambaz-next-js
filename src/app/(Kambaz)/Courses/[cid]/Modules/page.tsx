import { ListGroup, ListGroupItem } from "react-bootstrap";
import ModulesControls from "./ModulesControls";
import { BsGripVertical } from "react-icons/bs";
import ModulesControlButtons from "./ModulesControlButtons";
import LessonControlButtons from "./LessonControlButtons";
export default function Modules() {
  return (
    <div>
      
      
 <ModulesControls /><br /><br /><br /><br />
  <ListGroup className="rounded-0" id="wd-modules">
    <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
      <div className="wd-title p-3 ps-2 bg-secondary">
        <BsGripVertical className="me-2 fs-3" /> Week 1 <ModulesControlButtons />
</div>
            <ListGroup className="wd-lessons rounded-0">
        <ListGroupItem className="wd-lesson p-3 ps-1">
          <BsGripVertical className="me-2 fs-3" />LEARNING OBJECTIVES<LessonControlButtons /></ListGroupItem>
<ListGroupItem className="wd-lesson p-3 ps-1">
<BsGripVertical className="me-2 fs-3" /><span className="ms-4">Introduction to the courses</span><LessonControlButtons /></ListGroupItem>
        <ListGroupItem className="wd-lesson p-3 ps-1"><BsGripVertical className="me-2 fs-3" /><span className="ms-4">Learn what is Web Development</span><LessonControlButtons /></ListGroupItem>
        <ListGroupItem className="wd-lesson p-3 ps-1"><BsGripVertical className="me-2 fs-3" />GETTING STARTED<LessonControlButtons /></ListGroupItem>
<ListGroupItem className="wd-lesson p-3 ps-1"><BsGripVertical className="me-2 fs-3" /><span className="ms-4">Set up the development environment</span><LessonControlButtons /></ListGroupItem>
<ListGroupItem className="wd-lesson p-3 ps-1"><BsGripVertical className="me-2 fs-3" /><span className="ms-4">Create your first Next.js app</span><LessonControlButtons /></ListGroupItem>                   
 </ListGroup>
    </ListGroupItem>
    
<ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
      <div className="wd-title p-3 ps-2 bg-secondary"><BsGripVertical className="me-2 fs-3" />Week 2<ModulesControlButtons /></div>
 <ListGroup className="wd-lessons rounded-0">
        <ListGroupItem className="wd-lesson p-3 ps-1">
<BsGripVertical className="me-2 fs-3" />LEARNING OBJECTIVES<LessonControlButtons /></ListGroupItem>
<ListGroupItem className="wd-lesson p-3 ps-1"><BsGripVertical className="me-2 fs-3" /><span className="ms-4">Introduction to the HTML</span><LessonControlButtons /></ListGroupItem>

<ListGroupItem className="wd-lesson p-3 ps-1"><BsGripVertical className="me-2 fs-3" /><span className="ms-4">Learn what is HTML</span><LessonControlButtons /></ListGroupItem>
              <ListGroupItem className="wd-lesson p-3 ps-1"><BsGripVertical className="me-2 fs-3" />GETTING STARTED<LessonControlButtons /></ListGroupItem>
              <ListGroupItem className="wd-lesson p-3 ps-1"><BsGripVertical className="me-2 fs-3" /><span className="ms-4">CHAPTER 1</span><LessonControlButtons /></ListGroupItem>
                <ListGroupItem className="wd-lesson p-3 ps-1"><BsGripVertical className="me-2 fs-3" /><span className="ms-4">Create your first HTML Page</span><LessonControlButtons /></ListGroupItem>
      </ListGroup>
    </ListGroupItem>
  </ListGroup>

<ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
      <div className="wd-title p-3 ps-2 bg-secondary"><BsGripVertical className="me-2 fs-3" />Week 3<ModulesControlButtons /></div>
    </ListGroupItem>
    </div>
);}


