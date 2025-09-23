export default function Modules() {
  return (
    <div>
      <button>Collapse All</button> <button>View Progress</button> <select id="wd-select-one-genre"><option>Publish All</option></select> <button>+ Module </button>
      <ul id="wd-modules">
        <li className="wd-module">
          <div className="wd-title">Week 1</div>
          <ul className="wd-lessons">
            <li className="wd-lesson">
              <span className="wd-title">LEARNING OBJECTIVES</span>
              <ul className="wd-content">
                <li className="wd-content-item">Introduction to the course</li>
                <li className="wd-content-item">Learn what is Web Development</li>
              </ul>
            </li>
          </ul>
           <ul className="wd-lessons">
            <li className="wd-lesson">
              <span className="wd-title">GETTING STARTED</span>
              <ul className="wd-content">
                <li className="wd-content-item">Set up the development environment</li>
                <li className="wd-content-item">Create your first Next.js app</li>
              </ul>
            </li>
          </ul>
        </li>
        <li className="wd-module">
          <div className="wd-title">Week 2</div>
                    <ul className="wd-lessons">
            <li className="wd-lesson">
              <span className="wd-title">LEARNING OBJECTIVES</span>
              <ul className="wd-content">
                <li className="wd-content-item">Introduction to the HTML</li>
                <li className="wd-content-item">Learn what is HTML</li>
              </ul>
            </li>
          </ul>
           <ul className="wd-lessons">
            <li className="wd-lesson">
              <span className="wd-title">GETTING STARTED</span>
              <ul className="wd-content">
                <li className="wd-content-item">CHAPTER 1</li>
                <li className="wd-content-item">Create your first HTML Page</li>
              </ul>
            </li>
          </ul>
        </li>

        <li className="wd-module">
          <div className="wd-title">Week 3</div>
        </li>
      </ul>
    </div>
);}


