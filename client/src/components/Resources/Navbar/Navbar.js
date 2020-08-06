import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { NavLink } from "react-router-dom";

import LogoutButton from "./logout-button";
import LoginButton from "./login-button";
import "./Navbar.css";

// navbar. sits at the top of the page. Rendering changes depending on the authentication
// status of the user. When logged in will display menu items and a logout button.
// When logged out will only display the logo and a login button

const Navbar = ({ match }) => {
  const { isAuthenticated } = useAuth0();

  return (
    <nav className="main-navbar">
      {isAuthenticated ? (
        <ul>
          <li>
            <NavLink
              to="/dashboard/list"
              activeClassName="nav-link-active"
              className="nav-link"
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/groups"
              activeClassName="nav-link-active"
              className="nav-link"
            >
              Groups
            </NavLink>
          </li>
        </ul>
      ) : (
        <div></div>
      )}

      {/* Needs to be an "a" tag. NavLink and Link will get stuck in the nested router and not redirect properly. */}
      <a href="/">
        <div className="crisol-logo"></div>
      </a>
      {isAuthenticated ? <LogoutButton /> : <LoginButton />}
    </nav>
  );
};

export default Navbar;
