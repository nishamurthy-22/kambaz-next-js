/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ReactNode, useEffect, useState } from "react";
import CourseNavigation from "./Navigation";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { RootState } from "../../store";
import { FaAlignJustify } from "react-icons/fa";
import Breadcrumb from "./Breadcrumb";

export default function CoursesLayout({ children }: { children: ReactNode }) {
  const { cid } = useParams();
  const router = useRouter();
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { enrollments } = useSelector((state: RootState) => state.enrollmentsReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  
  const course = courses.find((course: any) => course._id === cid);
  const userId = (currentUser as any)?._id;
  const isFaculty = (currentUser as any)?.role === "FACULTY";
  
  const isEnrolled = enrollments.some(
    (e: any) => String(e.user) === String(userId) && String(e.course) === String(cid)
  );

  // Faculty can access any course, students can only access enrolled courses
  const canAccessCourse = isFaculty ? true : isEnrolled;

  useEffect(() => {
    if (currentUser && !canAccessCourse) {
      router.push("/Dashboard");
    }
  }, [currentUser, canAccessCourse, router]);

  if (currentUser && !canAccessCourse) {
    return null;
  }

  return (
    <div id="wd-courses">
      <h2 style={{ color: "red" }}>
        <FaAlignJustify 
          className="me-4 fs-4 mb-1" 
          style={{ cursor: "pointer"}}
          onClick={() => setSidebarVisible(!sidebarVisible)}
        />
       <Breadcrumb course={course} />
      </h2>
      <hr />
      <div className="d-flex">
        {sidebarVisible && (
          <div>
            <CourseNavigation />
          </div>
        )}
        <div className="flex-fill">{children}</div>
      </div>
    </div>
  );
}
