"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-key */
import { useEffect, useState } from "react";
import Link from "next/link";
import { CardImg, CardText, CardTitle, Row, Col, Button, Card, CardBody, FormControl} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addNewCourse, deleteCourse, updateCourse, setCourses } from "../Courses/reducer";
import { addEnrollment, removeEnrollment, setEnrollments } from "../Enrollments/reducer";
import { RootState } from "../store";
import { useRouter } from "next/navigation";
import * as client from "../Courses/client";

export default function Dashboard() {
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const { enrollments } = useSelector((state: RootState) => state.enrollmentsReducer);
  const dispatch = useDispatch();
  const router = useRouter();
  const userId = (currentUser as any)?._id;
  const isFaculty = (currentUser as any)?.role === "FACULTY";
  
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [course, setCourse] = useState<any>({
    _id: "0", 
    name: "New Course", 
    number: "New Number",
    startDate: "2023-09-10", 
    endDate: "2023-12-15",
    img: "/images/reactjs.jpg", 
    description: "New Description"
  });
  const onAddNewCourse = async () => {
    const newCourse = await client.createCourse(course);
    dispatch(setCourses([ ...courses, newCourse ]));
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
    if (currentUser) {
      fetchEnrollments();
    }
  };


  const fetchCourses = async () => {
    try {
      const allCourses = await client.fetchAllCourses();
      dispatch(setCourses(allCourses));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEnrollments = async () => {
    try {
      if (currentUser) {
        const enrollments = await client.findEnrollmentsForUser();
        dispatch(setEnrollments(enrollments));
      }
    } catch (error: any) {
      // Silently handle 401 errors (user not logged in or session expired)
      if (error?.response?.status !== 401) {
        console.error(error);
      }
      // Set empty enrollments if fetch fails
      dispatch(setEnrollments([]));
    }
  };

  useEffect(() => {
    fetchCourses();
    if (currentUser) {
      fetchEnrollments();
    }
  }, [currentUser]);


  const isEnrolled = (courseId: string) => {
    return enrollments.some(
      (e: any) => e.user === userId && e.course === courseId
    );
  };

  const filteredCourses = showAllCourses
    ? courses
    : courses.filter((course: any) => isEnrolled(course._id));

  const handleEnrollment = async (courseId: string, event: any) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      if (isEnrolled(courseId)) {
        await client.unenrollUserFromCourse(courseId);
        dispatch(removeEnrollment({ userId, courseId }));
        if (!showAllCourses) {
          setShowAllCourses(true);
        }
      } else {
        await client.enrollUserInCourse(courseId);
        dispatch(addEnrollment({ userId, courseId }));
      }
      await fetchEnrollments();
    } catch (error: any) {
      if (error?.response?.status === 401) {
        console.error("Unauthorized: Please log in again");
      } else {
        console.error("Error handling enrollment:", error);
      }
    }
  };

  const handleCourseClick = (courseId: string, event: any) => {
    if (!isEnrolled(courseId)) {
      event.preventDefault();
      return;
    }
    router.push(`/Courses/${courseId}/Home`);
  };

  const onDeleteCourse = async (courseId: string) => {
    const status = await client.deleteCourse(courseId);
    dispatch(setCourses(courses.filter((course) => course._id !== courseId)));
  };

  const onUpdateCourse = async () => {
    await client.updateCourse(course);
    dispatch(setCourses(courses.map((c) => {
        if (c._id === course._id) { return course; }
        else { return c; }
    })));
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
        <Button
          variant="primary"
          onClick={() => setShowAllCourses(!showAllCourses)}
          id="wd-enrollments-button"
        >
          {showAllCourses ? "Show Enrolled" : "Enrollments"}
        </Button>
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
        {showAllCourses ? "All Courses" : "Published Courses"} ({filteredCourses.length})
      </h2> 
      <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {filteredCourses.map((course: any) => {
            const enrolled = isEnrolled(course._id);
            return (
              <Col key={course._id} className="wd-dashboard-course" style={{ width: "300px" }}>
                <Card>
                  <Link 
                    href={enrolled && !showAllCourses ? `/Courses/${course._id}/Home` : "#"}
                    onClick={(e) => {
                      if (showAllCourses || e.target instanceof HTMLButtonElement || (e.target as HTMLElement).closest('button')) {
                        e.preventDefault();
                        return;
                      }
                      handleCourseClick(course._id, e);
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
                            {enrolled ? (
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