/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import * as client from "../client";
import { FormControl } from "react-bootstrap";
import { FaPlus, FaUserCircle } from "react-icons/fa";
import PeopleDetails from "../../Courses/[cid]/People/Details";

export default function Users() {
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const isAdmin = (currentUser as any)?.role === "ADMIN";

  // Restrict access to admins only
  useEffect(() => {
    if (currentUser && !isAdmin) {
      router.push("/Account/Profile");
    }
  }, [currentUser, isAdmin, router]);

  const [users, setUsers] = useState<any[]>([]);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [showUserId, setShowUserId] = useState<string | null>(null);
    const createUser = async () => {
    const user = await client.createUser({
      firstName: "New",
      lastName: `User${users.length + 1}`,
      username: `newuser${Date.now()}`,
      password: "password123",
      email: `email${users.length + 1}@neu.edu`,
      section: "S101",
      role: "STUDENT",
    });
    setUsers([...users, user]);
  };


  const { uid } = useParams();
  const fetchUsers = async () => {
    const users = await client.findAllUsers();
    setUsers(users);
  };

  useEffect(() => {
    fetchUsers();
  }, [uid]);

  const filterUsersByRole = async (role: string) => {
    setRole(role);
    if (role) {
      const users = await client.findUsersByRole(role);
      setUsers(users);
    } else {
      fetchUsers();
    }
  };

  const filterUsersByName = async (name: string) => {
    setName(name);
    if (name) {
      const users = await client.findUsersByPartialName(name);
      setUsers(users);
    } else {
      fetchUsers();
    }
  };


  const handleUserClick = (userId: string) => {
    setShowDetails(true);
    setShowUserId(userId);
  };

  return (
    <>
      {showDetails && showUserId && (
        <PeopleDetails
          uid={showUserId}
          onClose={() => {
            setShowDetails(false);
            setShowUserId(null);
          }}
        />
      )}
      <div style={{ marginRight: showDetails ? "25%" : "0" }}>
      <h3>Users</h3>
            <button onClick={createUser} className="float-end btn btn-danger wd-add-people">
        <FaPlus className="me-2" />
        Users
      </button>
      <div className="d-flex gap-3 mb-4">
      <FormControl
        onChange={(e) => filterUsersByName(e.target.value)}
        placeholder="Search people"
        className="w-25"
      />
      <select
        value={role}
        onChange={(e) => filterUsersByRole(e.target.value)}
        className="form-select w-25"
      >
        <option value="">All Roles</option>
        <option value="STUDENT">Students</option>
        <option value="TA">Assistants</option>
        <option value="FACULTY">Faculty</option>
        <option value="ADMIN">Administrators</option>
      </select></div>
      <div id="wd-people-table">
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Login ID</th>
                <th>Section</th>
                <th>Role</th>
                <th>Last Activity</th>
                <th>Total Activity</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user: any) => (
                <tr key={user._id}>
                  <td className="wd-full-name text-nowrap">
                    <FaUserCircle className="me-2 fs-1 text-secondary" />
                    <span
                      className="text-decoration-none text-danger"
                      onClick={() => handleUserClick(user._id)}
                      style={{ cursor: "pointer", userSelect: "none" }}
                    >
                      <span className="wd-first-name">{user.firstName}</span>{" "}
                      <span className="wd-last-name">{user.lastName}</span>
                    </span>
                  </td>
                  <td className="wd-login-id">{user.loginId}</td>
                  <td className="wd-section">{user.section}</td>
                  <td className="wd-role">{user.role}</td>
                  <td className="wd-last-activity">{user.lastActivity}</td>
                  <td className="wd-total-activity">{user.totalActivity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </>
  );
}
