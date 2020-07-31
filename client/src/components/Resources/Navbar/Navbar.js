import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { NavLink } from "react-router-dom";

import LogoutButton from "./logout-button";
import LoginButton from "./login-button";
import './Navbar.css'

const Navbar = ({match}) => {
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
            >Dashboard</NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/groups"
              activeClassName="nav-link-active"
              className="nav-link"
            >Groups</NavLink>
          </li>
        </ul>
      ) : (<div></div>)}
      {isAuthenticated ? <LogoutButton /> : <LoginButton />}
    </nav>
  );
}

export default Navbar;
