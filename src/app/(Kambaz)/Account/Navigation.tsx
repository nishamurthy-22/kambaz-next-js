"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Nav, NavItem, NavLink } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export default function AccountNavigation() {
const currentUser = useSelector(
  (state: RootState) => state.accountReducer.currentUser
) as { role?: string } | null;
  const links = currentUser ? ["Profile"] : ["Signin", "Signup"];
  const pathname = usePathname();

  return (
    <Nav variant="pills">
      {links.map((link) => (
        <NavItem key={link}>
          <NavLink
            as={Link}
            href={`/Account/${link}`}
            active={pathname.endsWith(link.toLowerCase())}
          >
            {link}
          </NavLink>

          {currentUser && currentUser.role === "ADMIN" && (
            <NavLink
              as={Link}
              href={`/Account/User`}
              active={pathname.endsWith("User")}
            >
              Users
            </NavLink>
          )}
        </NavItem>
      ))}
    </Nav>
  );
}
