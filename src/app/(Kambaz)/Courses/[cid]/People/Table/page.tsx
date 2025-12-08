/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import PeopleDetails from "../Details";
import Link from "next/link";
import { RootState } from "../../../../store";
import * as client from "../../../../Account/client";
import * as coursesClient from "../../../../Courses/client";
import { FaUserCircle } from "react-icons/fa";
import { Button, Modal, Form } from "react-bootstrap";

export default function PeopleTablePage() {
  const { cid } = useParams();
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const isAdmin = (currentUser as any)?.role === "ADMIN";
  const isFaculty = (currentUser as any)?.role === "FACULTY";
  const canEdit = isFaculty || isAdmin;

  const [users, setUsers] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showUserId, setShowUserId] = useState<string | null>(null);

  const handleUserClick = (userId: string) => {
    setShowDetails(true);
    setShowUserId(userId);
  };
  const [formData, setFormData] = useState<any>({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    dob: "",
    role: "STUDENT",
    loginId: "",
    section: "",
    lastActivity: "",
    totalActivity: "",
  });

  const fetchUsers = async () => {
    if (!cid) return;
    const fetchedUsers = await coursesClient.findUsersForCourse(cid as string);
    setUsers(fetchedUsers);
  };

  useEffect(() => {
    fetchUsers();
  }, [cid]);

  const resetForm = () =>
    setFormData({
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      email: "",
      dob: "",
      role: "STUDENT",
      loginId: "",
      section: "",
      lastActivity: "",
      totalActivity: "",
    });

  const handleCreate = () => {
    setEditingUser(null);
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData({ ...user, password: "" });
    setShowModal(true);
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    await client.deleteUser(userId);
    await fetchUsers();
  };

  const handleSave = async () => {
    if (editingUser) {
      const updatedUser = { ...editingUser, ...formData };
      if (!updatedUser.password) {
        delete updatedUser.password;
      }
      await client.updateUser(updatedUser);
    } else {
      await client.createUser(formData);
    }
    setShowModal(false);
    setEditingUser(null);
    await fetchUsers();
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingUser(null);
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
          onEdit={canEdit ? (user: any) => {
            setShowDetails(false);
            setShowUserId(null);
            handleEdit(user);
          } : undefined}
          onDelete={async () => {
            await fetchUsers();
          }}
          onUpdate={async () => {
            await fetchUsers();
          }}
        />
      )}
      <div id="wd-people-table" style={{ marginRight: showDetails ? "25%" : "0" }}>
      {isFaculty && (
        <div className="mb-3">
          <Button variant="primary" onClick={handleCreate}>
            Add User
          </Button>
        </div>
      )}
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
              {isFaculty && <th>Actions</th>}
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
                {isFaculty && (
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editingUser ? "Edit User" : "Add User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                disabled={!!editingUser}
              />
            </Form.Group>
            {!editingUser && (
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </Form.Group>
            )}
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="STUDENT">Student</option>
                <option value="FACULTY">Faculty</option>
                <option value="TA">TA</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Login ID</Form.Label>
              <Form.Control
                value={formData.loginId}
                onChange={(e) => setFormData({ ...formData, loginId: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Section</Form.Label>
              <Form.Control
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Activity</Form.Label>
              <Form.Control
                value={formData.lastActivity}
                onChange={(e) => setFormData({ ...formData, lastActivity: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Total Activity</Form.Label>
              <Form.Control
                value={formData.totalActivity}
                onChange={(e) => setFormData({ ...formData, totalActivity: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      </div>
    </>
  );
}