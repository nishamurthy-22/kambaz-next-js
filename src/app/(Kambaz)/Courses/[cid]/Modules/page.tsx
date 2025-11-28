/* eslint-disable @next/next/no-assign-module-variable */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-key */
"use client"
import { v4 as uuidv4 } from "uuid";
import { useParams } from "next/navigation";
import * as client from "../../client";
import { FormControl, ListGroup, ListGroupItem } from "react-bootstrap";
import ModulesControls from "./ModulesControls";
import { BsGripVertical } from "react-icons/bs";
import ModulesControlButtons from "./ModulesControlButtons";
import LessonControlButtons from "./LessonControlButtons";
import { useState, useEffect } from "react";
import { setModules, addModule, editModule, updateModule, deleteModule }
  from "./reducer";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
export default function Modules() {
    const { cid } = useParams();
    const [moduleName, setModuleName] = useState("");
     const { modules } = useSelector((state: RootState) => state.modulesReducer);
    const { currentUser } = useSelector((state: RootState) => state.accountReducer);
    const isFaculty = (currentUser as any)?.role === "FACULTY";
    const dispatch = useDispatch();
  const onUpdateModule = async (module: any) => {
    if (!isFaculty) return;
    await client.updateModule(cid as string,module);
    const newModules = modules.map((m: any) => m._id === module._id ? module : m );
    dispatch(setModules(newModules));
  };

      const onRemoveModule = async (moduleId: string) => {
    if (!isFaculty) return;
    await client.deleteModule(cid as string,moduleId);
    dispatch(setModules(modules.filter((m: any) => m._id !== moduleId)));
  };

      const onCreateModuleForCourse = async () => {
    if (!isFaculty || !cid) return;
    const newModule = { name: moduleName, course: cid };
    const module = await client.createModuleForCourse(cid as string, newModule);
    dispatch(setModules([...modules, module]));
  };
    const fetchModules = async () => {
    const modules = await client.findModulesForCourse(cid as string);
    dispatch(setModules(modules));
  };
  useEffect(() => {
    fetchModules();
  }, []);

  return (
    <div>     
 <ModulesControls setModuleName={setModuleName} moduleName={moduleName} addModule={onCreateModuleForCourse} isFaculty={isFaculty} />
      <br /><br /><br /><br />
      <ListGroup id="wd-modules" className="rounded-0">
        {modules.map((module: any) => (
          <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
    <div className="wd-title p-3 ps-2 bg-secondary">
      <BsGripVertical className="me-2 fs-3" />
      {!module.editing && module.name}
      { module.editing && isFaculty && (
        <FormControl className="w-50 d-inline-block"
               onChange={(e) =>  dispatch(
                        updateModule({ ...module, name: e.target.value })
                      )}
               onKeyDown={(e) => {
                 if (e.key === "Enter") {
                    onUpdateModule({ ...module, editing: false });
                 }
               }}
               defaultValue={module.name}/>
      )}
      {isFaculty && (
        <ModulesControlButtons
          moduleId={module._id}
          deleteModule={(moduleId) => onRemoveModule(moduleId)}
          editModule={(moduleId) => dispatch(editModule(moduleId))}/>
      )}
      </div>
            {module.lessons && (
              <ListGroup className="wd-lessons rounded-0">
                {module.lessons.map((lesson: any) => (
                  <ListGroupItem className="wd-lesson p-3 ps-1">
                    <BsGripVertical className="me-2 fs-3" /> {lesson.name} <LessonControlButtons />
                  </ListGroupItem>
                ))}</ListGroup>)}</ListGroupItem>))}</ListGroup>
    </div>
);}


