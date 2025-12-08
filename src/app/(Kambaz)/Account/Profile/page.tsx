/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import * as client from "../client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../reducer";
import { RootState } from "../../store";
import { Button, FormControl, Alert } from "react-bootstrap";

export default function Profile() {
  const [profile, setProfile] = useState<any>({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);

  const updateProfile = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const updatedProfile = await client.updateUser(profile);
      dispatch(setCurrentUser(updatedProfile));
      setSuccess("Profile updated successfully!");
      setIsLoading(false);
      
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err: any) {
      setIsLoading(false);
      
      if (err.response?.status === 401) {
        setError("Session expired. Please sign in again.");
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.message || "Invalid profile data");
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else if (err.code === "ERR_NETWORK") {
        setError("Cannot connect to server. Please check if the backend is running.");
      } else {
        setError("Failed to update profile. Please try again.");
      }
    }
  };

  const fetchProfile = () => {
    if (!currentUser) {
      router.push("/Account/Signin");
      return;
    }
    setProfile(currentUser);
  };

  const signout = async () => {
    try {
      await client.signout();
      dispatch(setCurrentUser(null));
      router.push("/Account/Signin");
    } catch (err) {
      dispatch(setCurrentUser(null));
      router.push("/Account/Signin");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [currentUser]);

  if (!currentUser) {
    return null;
  }

  return (
    <div className="wd-profile-screen" style={{ maxWidth: "600px" }}>
      <h3>Profile</h3>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      {profile && (
        <div>
          <FormControl
            id="wd-username"
            className="mb-2"
            placeholder="Username"
            value={profile.username || ""}
            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
            disabled={isLoading}
          />

          <FormControl
            id="wd-password"
            className="mb-2"
            placeholder="Password"
            type="password"
            value={profile.password || ""}
            onChange={(e) => setProfile({ ...profile, password: e.target.value })}
            disabled={isLoading}
          />

          <FormControl
            id="wd-firstname"
            className="mb-2"
            placeholder="First Name"
            value={profile.firstName || ""}
            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
            disabled={isLoading}
          />

          <FormControl
            id="wd-lastname"
            className="mb-2"
            placeholder="Last Name"
            value={profile.lastName || ""}
            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
            disabled={isLoading}
          />

          <FormControl
            id="wd-dob"
            className="mb-2"
            type="date"
            value={profile.dob || ""}
            onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
            disabled={isLoading}
          />

          <FormControl
            id="wd-email"
            className="mb-2"
            placeholder="Email"
            type="email"
            value={profile.email || ""}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            disabled={isLoading}
          />

          <select
            className="form-control mb-2"
            id="wd-role"
            value={profile.role || "USER"}
            onChange={(e) => setProfile({ ...profile, role: e.target.value })}
            disabled={isLoading}
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
            <option value="FACULTY">Faculty</option>
            <option value="STUDENT">Student</option>
          </select>

          <Button
            onClick={updateProfile}
            className="btn btn-primary w-100 mb-2"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update"}
          </Button>

          <Button
            onClick={signout}
            className="w-100 mb-2"
            id="wd-signout-btn"
            variant="secondary"
            disabled={isLoading}
          >
            Sign out
          </Button>
        </div>
      )}
    </div>
  );
}
