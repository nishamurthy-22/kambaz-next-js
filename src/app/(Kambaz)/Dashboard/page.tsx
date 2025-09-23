import Link from "next/link";
import Image from "next/image";
export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (8)</h2> <hr />
      <div id="wd-dashboard-courses">
        <div className="wd-dashboard-course">
          <Link href="/Courses/1234" className="wd-dashboard-course-link">
            <Image alt="" src="/images/reactjs.png" width={200} height={150} />
            <div>
              <h5> CS1234 React JS </h5>
              <p className="wd-dashboard-course-title">
                Full Stack software developer
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course"> 
             <Link href="/Courses/1234" className="wd-dashboard-course-link">
            <Image alt="" src="/images/dbms.jpg" width={200} height={150} />
            <div>
              <h5> CS5200 DBMS </h5>
              <p className="wd-dashboard-course-title">
                Database Management System
              </p>
              <button> Go </button>
            </div>
          </Link>
             </div>
        <div className="wd-dashboard-course"> 
            <Link href="/Courses/1234" className="wd-dashboard-course-link">
            <Image alt="" src="/images/java.png" width={200} height={150} />
            <div>
              <h5> CS5010 PDP </h5>
              <p className="wd-dashboard-course-title">
                Programming Design Paradigm
              </p>
              <button> Go </button>
            </div>
          </Link> </div>
        
        <div className="wd-dashboard-course"> 
            <Link href="/Courses/1234" className="wd-dashboard-course-link">
            <Image alt="" src="/images/algo.jpg" width={200} height={150} />
            <div>
              <h5> CS5800 Algorithms </h5>
              <p className="wd-dashboard-course-title">
                Design and Analysis of Algorithms
              </p>
              <button> Go </button>
            </div>
          </Link> </div>

        <div className="wd-dashboard-course"> 
            <Link href="/Courses/1234" className="wd-dashboard-course-link">
            <Image alt="" src="/images/ml.jpg" width={200} height={150} />
            <div>
              <h5> CS6140 ML </h5>
              <p className="wd-dashboard-course-title">
                Meachine Learning
              </p>
              <button> Go </button>
            </div>
          </Link> </div>

        <div className="wd-dashboard-course"> 
            <Link href="/Courses/1234" className="wd-dashboard-course-link">
            <Image alt=""src="/images/nlp.jpg" width={200} height={150} />
            <div>
              <h5> CS1234 NLP </h5>
              <p className="wd-dashboard-course-title">
                Natural Languae Processing
              </p>
              <button> Go </button>
            </div>
          </Link> </div>

        <div className="wd-dashboard-course"> 
            <Link href="/Courses/1234" className="wd-dashboard-course-link">
            <Image alt="" src="/images/mlops.jpg" width={200} height={150} />
            <div>
              <h5> CS7120 MLOPS </h5>
              <p className="wd-dashboard-course-title">
                Machine Learning and Operations
              </p>
              <button> Go </button>
            </div>
          </Link> </div>

        <div className="wd-dashboard-course"> 
            <Link href="/Courses/1234" className="wd-dashboard-course-link">
            <Image alt="" src="/images/ai.jpg" width={200} height={150} />
            <div>
              <h5> CS5654 FAI </h5>
              <p className="wd-dashboard-course-title">
                Foundations of Artificial Intelligence
              </p>
              <button> Go </button>
            </div>
          </Link> </div>

      </div> 
    </div>
);}
