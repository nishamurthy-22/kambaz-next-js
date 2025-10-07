import Link from "next/link";
import { Form, FormControl } from "react-bootstrap";
export default function Profile() {
  return (
    <div id="wd-profile-screen" style={{maxWidth:"400px"}}>
      <h3>Profile</h3>
      <FormControl id="wd-username"
             placeholder="username"
             className="mb-2"
             defaultValue="alice" />
      <FormControl id="wd-password"
             placeholder="password"
             className="mb-2"
             defaultValue="123"
            //  type = "password" 
             />

      <FormControl id="wd-firstname"
             placeholder="First Name"
             className="mb-2"
             defaultValue="Alice" />

      <FormControl id="wd-lastname"
             placeholder="Last Name"
             className="mb-2"
             defaultValue="Wonderland" />
      <FormControl id="wd-dob"
             className="mb-2"
             defaultValue="2000-01-01" 
             type = "date"/>
      <FormControl id="wd-email"
             placeholder="email"
             className="mb-2"
             defaultValue="alice@wonderland"
             type = "email" />

      <FormControl id="wd-username"
             placeholder="username"
             className="mb-2"
             defaultValue="alice" />


<Form.Select defaultValue="FACULTY" id="wd-role" className="mb-2">
  <option value="USER">User</option>
  <option value="ADMIN">Admin</option>
  <option value="FACULTY">Faculty</option>
  <option value="STUDENT">Student</option>
</Form.Select>

      <Link id="wd-signin-btn"
            href="/Account/Signin"
            className="btn btn-danger w-100 mb-2">
            Sign out </Link>

    </div>
);}
