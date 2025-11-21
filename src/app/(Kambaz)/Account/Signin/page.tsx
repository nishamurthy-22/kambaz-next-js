/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import * as client from "../client";
import Link from "next/link";
import { redirect } from "next/dist/client/components/navigation";
import { setCurrentUser } from "../reducer";
import { useDispatch } from "react-redux";
import { useState } from "react";
import * as db from "../../Database";
import { FormControl, Button } from "react-bootstrap";
export default function Signin() {
   const [credentials, setCredentials] = useState<any>({});
 const dispatch = useDispatch();
const signin = async () => {
    const user =  await client.signin(credentials);
    if (!user) return;
    dispatch(setCurrentUser(user));
    redirect("/Account/Profile");
  };

 return (
   <div id="wd-signin-screen" style={{maxWidth:"400px"}}>
     <h3>Sign in</h3>
     <FormControl id="wd-username"
             placeholder="username"
             defaultValue={credentials.username}
             onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
             className="mb-2"/>
        <FormControl id="wd-password"
             placeholder="password" type="password"
             defaultValue={credentials.password}
             onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
             className="mb-2"/>
<Button onClick={signin} id="wd-signin-btn" className="w-100" > Sign in </Button>
<Link id="wd-signup-link" href="/Account/Signup">Sign up</Link>
   </div>
);}
