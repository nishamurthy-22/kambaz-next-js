/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { useParams } from "next/navigation";
import * as db from "../../../../Database";
import { FaUserCircle } from "react-icons/fa";

export default function PeopleTable() {
  const { cid } = useParams();
  const { users, enrollments } = db;

  const enrolledUsers = users?.filter((usr: any) =>
    enrollments?.some(
      (enrollment: any) =>
        enrollment.user === usr._id && enrollment.course === cid
    )
  );

  return (
    <div id="wd-people-table" className="table-responsive">
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
          {enrolledUsers?.map((user: any) => (
            <tr key={user._id}>
              <td className="wd-full-name text-nowrap">
                <FaUserCircle className="me-2 fs-1 text-secondary" />
                <span className="wd-first-name">{user.firstName} </span>
                <span className="wd-last-name">{user.lastName}</span>
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
  );
}
