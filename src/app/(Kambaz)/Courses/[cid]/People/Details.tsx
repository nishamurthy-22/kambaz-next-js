/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FaPencil } from "react-icons/fa6";
import { FaCheck, FaUserCircle } from "react-icons/fa";
import { Button, FormControl, Form } from "react-bootstrap";
import * as client from "../../../Account/client";

export default function PeopleDetails({ uid, onClose, onEdit }: { uid: string | null; onClose: () => void; onEdit?: (user: any) => void; }) {
  const [user, setUser] = useState<any>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [editing, setEditing] = useState(false);
  
  const saveUser = async () => {
    const [firstName, lastName] = name.split(" ");
    const updatedUser = { ...user, firstName, lastName, email, role };
    await client.updateUser(updatedUser);
    setUser(updatedUser);
    setEditing(false);
    onClose();
  };

    const deleteUser = async (uid: string) => {
    await client.deleteUser(uid);
    onClose();
  };

  const fetchUser = async () => {
    if (!uid) return;
    const user = await client.findUserById(uid);
    setUser(user);
    setName(`${user.firstName} ${user.lastName}`);
    setEmail(user.email || "");
    setRole(user.role || "");
  };
  useEffect(() => {
    if (uid) {
      fetchUser();
      setEditing(false);
    }
  }, [uid]);
  if (!uid) return null;
  return (
    <div 
      className="wd-people-details position-fixed bg-white p-4 shadow" 
      style={{ 
        zIndex: 9999, 
        width: "25%", 
        top: 0, 
        right: 0, 
        bottom: 0,
        minHeight: "100vh",
        overflowY: "auto"
      }}
    >
      <button onClick={onClose} className="btn position-absolute end-0 top-0 wd-close-details" style={{ zIndex: 1051, border: "none", background: "transparent" }}>
        <IoCloseSharp className="fs-1" />
      </button>
      <div className="text-center mt-2">
        <FaUserCircle className="text-secondary me-2 fs-1" />
      </div>
      <hr />
      <div className="text-danger fs-4 wd-name fw-bold mb-3">
        {!editing && (
          <>
            <FaPencil 
              onClick={() => {
                setName(`${user.firstName} ${user.lastName}`);
                setEmail(user.email || "");
                setRole(user.role || "");
                setEditing(true);
              }}
              className="float-end fs-5 mt-2 wd-edit" 
              style={{ cursor: "pointer" }}
            />
            <div 
              className="wd-name"
              onClick={() => {
                setName(`${user.firstName} ${user.lastName}`);
                setEmail(user.email || "");
                setRole(user.role || "");
                setEditing(true);
              }}
              style={{ cursor: "pointer" }}
            >
              {user.firstName} {user.lastName}
            </div>
          </>
        )}
        {editing && (
          <>
            <FaCheck 
              onClick={() => saveUser()}
              className="float-end fs-5 mt-2 me-2 wd-save"
              style={{ cursor: "pointer" }}
            />
            <FormControl 
              className="w-50 wd-edit-name"
              value={name || `${user.firstName} ${user.lastName}`}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { saveUser(); }
              }}
              style={{ color: "black" }}
            />
          </>
        )}
      </div>
      <div className="mb-2">
        <b>Roles:</b>{" "}
        {!editing ? (
          <span className="wd-roles">{user.role}</span>
        ) : (
          <Form.Select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="d-inline-block w-auto ms-2"
          >
            <option value="STUDENT">STUDENT</option>
            <option value="FACULTY">FACULTY</option>
            <option value="TA">TA</option>
            <option value="ADMIN">ADMIN</option>
          </Form.Select>
        )}
      </div>
      <div className="mb-2">
        <b>Email:</b>{" "}
        {!editing ? (
          <span className="wd-email">{user.email}</span>
        ) : (
          <FormControl
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="d-inline-block w-auto ms-2"
            style={{ color: "black" }}
          />
        )}
      </div>
      <div className="mb-2">
        <b>Login ID:</b> <span className="wd-login-id">{user.loginId}</span>
      </div>
      <div className="mb-2">
        <b>Section:</b> <span className="wd-section">{user.section}</span>
      </div>
      <div className="mb-4">
        <b>Total Activity:</b> <span className="wd-total-activity">{user.totalActivity}</span>
      </div>
      <hr />
      <div className="d-flex justify-content-end gap-2">
        <button 
          onClick={onClose}
          className="btn btn-secondary wd-cancel"
        >
          Cancel
        </button>
        <button 
          onClick={() => deleteUser(uid)} 
          className="btn btn-danger wd-delete"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
