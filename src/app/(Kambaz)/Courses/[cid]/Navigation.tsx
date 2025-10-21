"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useParams } from "next/navigation";

export default function CourseNavigation() {
  const pathname = usePathname();
  const { cid } = useParams();  
  const links = ["Home", "Modules", "Piazza", "Zoom", "Assignments", "Quizzes", "Grades", "People"];

  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      {links.map((label) => {
        const href =
          label === "People"
            ? `/Courses/${cid}/People/Table`
            : `/Courses/${cid}/${label}`;
        const isActive = pathname === href || (label === "Home" && pathname === `/Courses/${cid}`);

        return (
          <Link
            key={label}
            href={href}
            id={`wd-course-${label.toLowerCase()}-link`}
            className={`list-group-item border-0 ${
              isActive ? "active text-black" : "text-danger"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}

