/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import * as client from "../client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setCurrentUser } from "../reducer";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { FormControl, Button, Alert } from "react-bootstrap";

export default function Signin() {
  const [credentials, setCredentials] = useState<any>({
    username: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const signin = async () => {
    // Clear previous errors
    setError("");

    // Validation
    if (!credentials.username || !credentials.password) {
      setError("Please enter both username and password");
      return;
    }

    setIsLoading(true);

    try {
      const user = await client.signin(credentials);
      if (!user) {
        setError("Invalid username or password");
        setIsLoading(false);
        return;
      }
      dispatch(setCurrentUser(user));
      router.push("/Dashboard");
    } catch (err: any) {
      setIsLoading(false);
      
      // Check for specific error messages from backend
      if (err.response?.status === 401) {
        setError(err.response?.data?.message || "Invalid username or password");
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else if (err.code === "ERR_NETWORK") {
        setError("Cannot connect to server. Please check if the backend is running.");
      } else {
        setError("An error occurred. Please try again.");
      }
      
      console.error("Signin error:", err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      signin();
    }
  };

  return (
    <div id="wd-signin-screen" style={{ maxWidth: "400px" }}>
      <h3>Sign in</h3>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <FormControl
        id="wd-username"
        placeholder="username"
        value={credentials.username}
        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
        onKeyPress={handleKeyPress}
        className="mb-2"
        disabled={isLoading}
      />

      <FormControl
        id="wd-password"
        placeholder="password"
        type="password"
        value={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        onKeyPress={handleKeyPress}
        className="mb-2"
        disabled={isLoading}
      />

      <Button 
        onClick={signin} 
        id="wd-signin-btn" 
        className="w-100 mb-2" 
        disabled={isLoading}
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>

      <Link id="wd-signup-link" href="/Account/Signup">Sign up</Link>
    </div>
  );
}
