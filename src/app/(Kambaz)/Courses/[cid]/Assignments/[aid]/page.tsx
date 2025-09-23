export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor">
      <label htmlFor="wd-name">Assignment Name</label>
      <input id="wd-name" defaultValue="A1 - ENV + HTML" /><br /><br />
      <textarea id="wd-description">
        The assignment is available online Submit a link to the landing page of your Web application running on Netlfiy. The ladning page should include the following: Your full name, section Links to each
        of the lab assignment, Link to the Kanbas application, Links to all relevant source code repositories. The Kanbas application should include a link to navigate back to the landing page.
      </textarea>
      <br />
      <table>
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-points">Points</label>
          </td>
          <td>
            <input id="wd-points" defaultValue={100} />
                      </td>
        </tr>

        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-group">Assignment Group</label>
          </td>
          <td>
            <select id="wd-group"><option>Assignments</option></select>
                      </td>
        </tr>

        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-display-grade-as">Display Grade as</label>
          </td>
          <td>
            <select id="wd-display-grade-as"><option>Percentage</option></select>
                      </td>
        </tr>

        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-submission-type">Submission Type</label>
          </td>
          <td>
            <select id="wd-submission-type"><option>Online</option></select>
          </td>
        </tr>

        <tr>
            <td align="right" valign="top">

            </td>
          <td>
            <label>Online Entry Options:</label><br/>

            <input type="checkbox" id="wd-text-entry"/>
            <label htmlFor="wd-text-entry">Text Entry</label><br/>

            <input type="checkbox" id="wd-website-url"/>
            <label htmlFor="wd-website-url">Website URL</label><br/>

            <input type="checkbox" id="wd-media-recordings"/>
            <label htmlFor="wd-media-recordings">Media Recordings</label><br/>

            <input type="checkbox" id="wd-student-annotation"/>
            <label htmlFor="wd-student-annotation">Student Annotation</label><br/>

            <input type="checkbox" id="wd-file-upload"/>
            <label htmlFor="wd-file-upload">File Uploads</label>


            </td>
        </tr>

        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-assign-to">Assign</label>
          </td>
          <td>
            Assign to<br/>
            <input id="wd-assign-to" defaultValue={'Everyone'} />
                      </td>
        </tr>

        <tr>
          <td align="right" valign="top">
          </td>
          <td>
            <label htmlFor="wd-due-date">Due</label><br/>
            <input id="wd-due-date" type = 'date' defaultValue= "2024-05-13"/>
                      </td>
        </tr>

        <tr>
          <td align="right" valign="top">
          </td>
          <td>
            <label htmlFor="wd-available-from">Available From</label><br/>
            <input id="wd-available-from" type = 'date' defaultValue="2024-05-06" />
                      </td>
            <td>
            <label htmlFor="wd-available-until">Until</label><br/>
            <input id="wd-available-until" type = 'date' defaultValue="2024-05-20" />
                      </td>  
        </tr>

 </table>
 <hr/>
       <div style={{ marginTop: "20px", textAlign: "right" }}>
        <button id="wd-cancel" type="button" style={{ marginRight: "10px" }}>
          Cancel
        </button>
        <button id="wd-save" type="submit">
          Save
        </button>
      </div>
    </div>
);}

