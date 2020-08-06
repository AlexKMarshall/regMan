import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

// handles the logout action. Provided as is by Auth0
const LogoutButton = () => {
  const { logout } = useAuth0();
  return (
    <button
      onClick={() =>
        logout({
          returnTo: window.location.origin,
        })
      }
      variant="danger"
      className="btn-margin logout"
    >
      Log Out
    </button>
  );
};

export default LogoutButton;
