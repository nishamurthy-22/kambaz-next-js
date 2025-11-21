import React, { useState } from "react";
import { FormControl } from "react-bootstrap";
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
export default function WorkingWithObjects() {
      const [assignment, setAssignment] = useState({
    id: 1, title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10", completed: false, score: 0,
  });

  const [module, setModule] = useState({
    id: 1, name: "Module 1",
    description: "Create a module for NodeJS server with ExpressJS",
    course: "Web Dev",
});
  const ASSIGNMENT_API_URL = `${HTTP_SERVER}/lab5/assignment`
  const MODULE_API_URL = `${HTTP_SERVER}/lab5/module`
  return (
    <div id="wd-working-with-objects">
      <h3>Working With Objects</h3>
      <h4>Retrieving Objects</h4>
      <a id="wd-retrieve-assignments" className="btn btn-primary"
         href={`${HTTP_SERVER}/lab5/assignment`}>
        Get Assignment
      </a><hr/>
            <h4>Retrieving Properties</h4>
      <a id="wd-retrieve-assignment-title" className="btn btn-primary"
         href={`${HTTP_SERVER}/lab5/assignment/title`}>
        Get Title
      </a><hr/>
            <h4>Modifying Properties</h4>
            <h5>Assignment Title</h5>
      <a id="wd-update-assignment-title"
         className="btn btn-primary float-end"
         href={`${ASSIGNMENT_API_URL}/title/${assignment.title}`}>
        Update Title </a>
      <FormControl className="w-75" id="wd-assignment-title"
        defaultValue={assignment.title} onChange={(e) =>
          setAssignment({ ...assignment, title: e.target.value })}/>
      <hr />

<h5>Assignment Score</h5>
<a
  id="wd-update-assignment-score"
  className="btn btn-primary float-end"
  href={`${ASSIGNMENT_API_URL}/score/${assignment.score}`}>Update Score</a>
<FormControl className="w-25"
  type="number" id="wd-assignment-score" defaultValue={assignment.score}
  onChange={(e) =>
    setAssignment({ ...assignment, score: Number(e.target.value) })
  }/>
<hr />

<h5>Assignment Completed</h5>
<a
  id="wd-update-assignment-completed"
  className="btn btn-primary float-end"
  href={`${ASSIGNMENT_API_URL}/completed/${assignment.completed}`}
>
  Update Completed
</a>

<input
  id="wd-assignment-completed"
  type="checkbox"
  checked={assignment.completed}
  onChange={(e) =>
    setAssignment({ ...assignment, completed: e.target.checked })
  }
/>
<hr />

<h4>Retrieving Objects</h4>
    <a id="wd-retrieve-modules" className="btn btn-primary"
         href={`${HTTP_SERVER}/lab5/module`}>
        Get Module
      </a><hr/>
<h4>Retrieving Properties</h4>
          <a id="wd-retrieve-modules" className="btn btn-primary"
         href={`${HTTP_SERVER}/lab5/module/name`}>
        Get Module Name
      </a><hr/>

      <h4>Modifying Module Properties</h4>
      <a id="wd-update-module-name"
         className="btn btn-primary float-end"
         href={`${MODULE_API_URL}/name/${module.name}`}>
        Update Name </a>
      <FormControl className="w-75" id="wd-module-name"
        defaultValue={module.name} onChange={(e) =>
          setModule({ ...module, name: e.target.value })}/>
      <hr />

<h5>Module Description</h5>
<div className="d-flex align-items-center gap-2">


<FormControl
  className="w-75"
  id="wd-module-description"
  defaultValue={module.description}
  onChange={(e) =>
    setModule({ ...module, description: e.target.value })
  }
/>
<a
  id="wd-update-module-description"
  className="btn btn-primary"
  href={`${MODULE_API_URL}/description/${module.description}`}
>
  Update Description
</a></div>
<hr />

    </div>
);}

