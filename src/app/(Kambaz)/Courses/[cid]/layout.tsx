import { ReactNode } from "react";
import { courses } from "../../Database";
import CourseNavigation from "./Navigation";
import { FaAlignJustify } from "react-icons/fa";
import Breadcrumb from "./Breadcrumb";

export default async function CoursesLayout({
  children,params,}: {children: React.ReactNode; params: Promise<{ cid: string }>;}) {
 const { cid } = await params;
  const course = courses.find((course) => course._id === cid);
  return (
    <div id="wd-courses">
      <div className="text-danger d-flex align-items-center fs-5">
        <FaAlignJustify className="me-3 fs-4" />
        <Breadcrumb course={course} />
      </div>
      <hr />
      <div className="d-flex">
        <div className="d-none d-md-block">
          <CourseNavigation />
        </div>
        <div className="flex-fill">{children}</div>
      </div>
    </div>
  );
}