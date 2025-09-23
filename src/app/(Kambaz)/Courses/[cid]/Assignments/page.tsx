import Link from "next/link";
export default function Assignments() {
  return (
    <div id="wd-assignments">
      <input placeholder="Search for Assignments" id="wd-search-assignment" /> <button id="wd-add-assignment-group">+ Group</button> <button id="wd-add-assignment">+ Assignment</button>
      <h3 id="wd-assignments-title">
        ASSIGNMENTS 40% of Total <button>+</button> </h3>
      <ul id="wd-assignment-list">
        <li className="wd-assignment-list-item">
          <Link href="/Courses/1234/Assignments/123"
             className="wd-assignment-link" >
            A1 - ENV + HTML
          </Link> </li>
          Multiple Modules | Not available until May 6 at 12:00 am | Due May 13 at 11:59pm | 100pts
        <li className="wd-assignment-list-item">
          <Link href="/Courses/1234/Assignments/124"
             className="wd-assignment-link" >
            A2 - CSS + BOOTSTRAP
          </Link> </li>
          Multiple Modules | Not available until May 13 at 12:00 am | Due May 20 at 11:59pm | 100pts
        <li className="wd-assignment-list-item">
          <Link href="/Courses/1234/Assignments/125"
             className="wd-assignment-link" >
            A3 - JAVASCRIPT + REACT
          </Link> </li>
          Multiple Modules | Not available until May 20 at 12:00 am | Due May 27 at 11:59pm | 100pts
      </ul>
      <h3 id="wd-assignments-title">
        QUIZZES 20% of Total <button>+</button> </h3>
        <ul>
        <li>Quiz 1</li>
        </ul>

      <h3 id="wd-assignments-title">
        EXAMS 20% of Total <button>+</button> </h3>
        <ul>
        <li>Midterm Exam</li>
        </ul>

      <h3 id="wd-assignments-title">
        PROJECTS 40% of Total <button>+</button> </h3>
        <ul>
        <li>Final Project</li>
        </ul>
    </div>
);}
