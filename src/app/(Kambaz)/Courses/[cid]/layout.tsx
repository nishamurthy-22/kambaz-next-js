/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ReactNode, useEffect, useState } from "react";
import CourseNavigation from "./Navigation";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { RootState } from "../../store";
import { FaAlignJustify } from "react-icons/fa";
import Breadcrumb from "./Breadcrumb";
import * as client from "../../Courses/client";
import { setEnrollments } from "../../Enrollments/reducer";

export default function CoursesLayout({ children }: { children: ReactNode }) {
  const { cid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { enrollments } = useSelector((state: RootState) => state.enrollmentsReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [isLoadingEnrollments, setIsLoadingEnrollments] = useState(false);
  
  const course = courses.find((course: any) => course._id === cid);
  const userId = (currentUser as any)?._id;
  const isFaculty = (currentUser as any)?.role === "FACULTY";
  
  // Load enrollments if not already loaded
  useEffect(() => {
    const fetchEnrollments = async () => {
      if (currentUser && enrollments.length === 0 && !isLoadingEnrollments) {
        setIsLoadingEnrollments(true);
        try {
          const fetchedEnrollments = await client.findEnrollmentsForUser();
          const normalizedEnrollments = fetchedEnrollments.map((e: any) => ({
            ...e,
            user: String(e.user),
            course: String(e.course),
          }));
          dispatch(setEnrollments(normalizedEnrollments));
        } catch (error: any) {
          if (error?.response?.status !== 401) {
            console.error(error);
          }
          dispatch(setEnrollments([]));
        } finally {
          setIsLoadingEnrollments(false);
        }
      }
    };
    
    fetchEnrollments();
  }, [currentUser, enrollments.length, dispatch, isLoadingEnrollments]);
  
  const isEnrolled = enrollments.some(
    (e: any) => String(e.user) === String(userId) && String(e.course) === String(cid)
  );

  // Faculty can access any course, students can only access enrolled courses
  const canAccessCourse = isFaculty ? true : isEnrolled;

  useEffect(() => {
    // Only redirect if we have user data and enrollments loaded
    if (currentUser && !isFaculty && !isLoadingEnrollments && enrollments.length > 0 && !canAccessCourse) {
      router.push("/Dashboard");
    }
  }, [currentUser, canAccessCourse, router, isFaculty, isLoadingEnrollments, enrollments.length]);

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
