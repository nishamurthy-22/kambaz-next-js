import Link from "next/link";
import { FormControl } from "react-bootstrap";
export default function Signup() {
  return (
    <div id="wd-signup-screen" style={{maxWidth:"400px"}}>
      <h3>Sign up</h3>
     <FormControl id="wd-username"
             placeholder="username"
             defaultValue={"nisha2211"}
             className="mb-2"/>
        <FormControl id="wd-password"
             placeholder="password" type="password"
             defaultValue={"nisha2211"}
             className="mb-2"/>
        <FormControl id="wd-confirm-password"
             placeholder="confirm password" type="password"
             defaultValue={"nisha2211"}
             className="mb-2"/>             

      <Link id="wd-signin-btn"
            href="/Account/Profile"
            className="btn btn-primary w-100 mb-2">
            Sign up </Link>

                  <Link id="wd-signin-btn"
            href="/Account/Signin"
            className="btn btn-primary w-100 mb-2">
            Sign in </Link>
    </div>
);}

