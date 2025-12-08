"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { CardImg, CardText, CardTitle, Row, Col, Button, Card, CardBody, FormControl} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setCourses } from "../Courses/reducer";
import { setEnrollments } from "../Enrollments/reducer";
import { RootState } from "../store";
import { useRouter } from "next/navigation";
import * as client from "../Courses/client";

export default function Dashboard() {
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const { enrollments } = useSelector((state: RootState) => state.enrollmentsReducer);
  const dispatch = useDispatch();
  const router = useRouter();
  
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [allCoursesList, setAllCoursesList] = useState<any[]>([]);
  const [course, setCourse] = useState<any>({
    _id: "0", 
    name: "New Course", 
    number: "New Number",
    startDate: "2023-09-10", 
    endDate: "2023-12-15",
    img: "/images/reactjs.jpg", 
    description: "New Description"
  });
  const fetchMyCourses = useCallback(async () => {
    try {
      if (currentUser) {
        const myCourses = await client.findMyCourses();
        const uniqueCourses = Array.from(
          new Map(myCourses.map((course: any) => [course._id, course])).values()
        );
        dispatch(setCourses(uniqueCourses));
      }
    } catch (error: any) {
      if (error?.response?.status !== 401) {
      }
      dispatch(setCourses([]));
    }
  }, [currentUser, dispatch]);

  const fetchAllCourses = useCallback(async () => {
    try {
      const allCourses = await client.fetchAllCourses();
      const uniqueCourses = Array.from(
        new Map(allCourses.map((course: any) => [course._id, course])).values()
      );
      return uniqueCourses;
    } catch {
      return [];
    }
  }, []);

  const fetchEnrollments = useCallback(async () => {
    try {
      if (currentUser) {
        const enrollments = await client.findEnrollmentsForUser();
        const normalizedEnrollments = enrollments.map((e: any) => ({
          ...e,
          user: String(e.user),
          course: String(e.course),
        }));
        dispatch(setEnrollments(normalizedEnrollments));
      }
    } catch (error: any) {
      if (error?.response?.status !== 401) {
      }
      dispatch(setEnrollments([]));
    }
  }, [currentUser, dispatch]);

  useEffect(() => {
    if (!currentUser) {
      router.push("/Account/Signin");
      return;
    }
    fetchMyCourses();
    fetchEnrollments();
    fetchAllCourses().then(setAllCoursesList);
  }, [currentUser, router, fetchMyCourses, fetchEnrollments, fetchAllCourses]);

  if (!currentUser) {
    return null;
  }

  const userId = (currentUser as any)?._id;
  const isFaculty = (currentUser as any)?.role === "FACULTY";

  const onAddNewCourse = async () => {
    try {
      await client.createCourse(course);
      await fetchMyCourses();
      await fetchEnrollments();
      const updatedAllCourses = await fetchAllCourses();
      setAllCoursesList(updatedAllCourses);
      setCourse({
        _id: "0", 
        name: "New Course", 
        number: "New Number",
        startDate: "2023-09-10", 
        endDate: "2023-12-15",
        img: "/images/reactjs.jpg", 
        description: "New Description"
      });
      setFormKey(prev => prev + 1);
    } catch {
      alert("Failed to create course. Please try again.");
    }
  };

  const isEnrolled = (courseId: string) => {
    if (!userId || !courseId) return false;
    return enrollments.some(
      (e: any) => String(e.user) === String(userId) && String(e.course) === String(courseId)
    );
  };

  const filteredCourses = showAllCourses ? allCoursesList : courses;

  const handleEnrollment = async (courseId: string, event: any) => {
    event.preventDefault();
    event.stopPropagation();
    if (!userId || !courseId) {
      return;
    }
    try {
      if (isEnrolled(courseId)) {
        await client.unenrollUserFromCourse(courseId);
      } else {
        await client.enrollUserInCourse(courseId);
      }
      await fetchEnrollments();
      await fetchMyCourses();
    } catch {
      await fetchEnrollments();
      await fetchMyCourses();
    }
  };


  const onDeleteCourse = async (courseId: string) => {
    try {
      const response = await client.deleteCourse(courseId);
      if (response) {
        await fetchMyCourses();
        const updatedAllCourses = await fetchAllCourses();
        setAllCoursesList(updatedAllCourses);
        if (currentUser) {
          await fetchEnrollments();
        }
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to delete course";
      alert(errorMessage);
    }
  };

  const onUpdateCourse = async () => {
    await client.updateCourse(course);
    await fetchMyCourses();
    const updatedAllCourses = await fetchAllCourses();
    setAllCoursesList(updatedAllCourses);
    setCourse({
      _id: "0", 
      name: "New Course", 
      number: "New Number",
      startDate: "2023-09-10", 
      endDate: "2023-12-15",
      img: "/images/reactjs.jpg", 
      description: "New Description"
    });
    setFormKey(prev => prev + 1);
  };

  return (
    <div id="wd-dashboard">
      <div className="d-flex justify-content-between align-items-center">
        <h1 id="wd-dashboard-title">Dashboard</h1>
        {!isFaculty && (
          <Button
            variant="primary"
            onClick={async () => {
              if (!showAllCourses) {
                const allCourses = await fetchAllCourses();
                setAllCoursesList(allCourses);
              }
              setShowAllCourses(!showAllCourses);
            }}
            id="wd-enrollments-button"
          >
            {showAllCourses ? "Show Enrolled" : "Enrollments"}
          </Button>
        )}
      </div>
      <hr />
      {isFaculty && (
        <>
          <h5>New Course
              <button className="btn btn-primary float-end"
                      id="wd-add-new-course-click"
                      onClick={onAddNewCourse}> Add </button>
                              <button className="btn btn-warning float-end me-2"
                    onClick={onUpdateCourse} id="wd-update-course-click">
              Update </button>
          </h5><br />
          <FormControl key={`name-${formKey}`} value={course.name} className="mb-2" onChange={(e) => setCourse({ ...course, name: e.target.value }) } />
          <FormControl key={`description-${formKey}`} as="textarea" value={course.description} rows={3} onChange={(e) => setCourse({ ...course, description: e.target.value }) } />
          <hr />
        </>
      )} 
      <h2 id="wd-dashboard-published">
        {showAllCourses 
          ? "All Courses" 
          : (isFaculty ? "My Courses" : "Enrolled Courses")} ({filteredCourses.length})
      </h2> 
      <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {filteredCourses.map((course: any) => {
            const enrolled = isEnrolled(course._id);
            const canAccessCourse = isFaculty ? true : enrolled;
            
            return (
              <Col key={course._id} className="wd-dashboard-course" style={{ width: "300px" }}>
                <Card>
                  <Link 
                    href={canAccessCourse && !showAllCourses ? `/Courses/${course._id}/Home` : "#"}
                    onClick={(e) => {
                      if (showAllCourses || e.target instanceof HTMLButtonElement || (e.target as HTMLElement).closest('button')) {
                        e.preventDefault();
                        return;
                      }
                      if (canAccessCourse && !showAllCourses) {
                        router.push(`/Courses/${course._id}/Home`);
                      }
                    }}
                    className="wd-dashboard-course-link text-decoration-none text-dark"
                  >
                    <CardImg src={course.img} variant="top" width="100%" height={160} />
                    <CardBody className="card-body">
                      <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                        {course.name}
                      </CardTitle>
                      <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                        {course.description}
                      </CardText>
                      <div className="d-flex justify-content-between align-items-center mt-3" onClick={(e) => e.stopPropagation()}>
                        {showAllCourses ? (
                          <Button
                            variant={enrolled ? "danger" : "success"}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleEnrollment(course._id, e);
                            }}
                          >
                            {enrolled ? "Unenroll" : "Enroll"}
                          </Button>
                        ) : (
                          <>
                            {canAccessCourse ? (
                              <Button 
                                variant="primary"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  router.push(`/Courses/${course._id}/Home`);
                                }}
                              >
                                Go
                              </Button>
                            ) : (
                              <div></div>
                            )}
                            
                            {isFaculty && (
                              <>
                                <button
                                  id="wd-edit-course-click"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setCourse(course);
                                  }}
                                  className="btn btn-warning me-2"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onDeleteCourse(course._id);
                                  }}
                                  className="btn btn-danger"
                                  id="wd-delete-course-click"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                            {!isFaculty && <div></div>}
                          </>
                        )}
                      </div>
                    </CardBody>
                  </Link>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
}