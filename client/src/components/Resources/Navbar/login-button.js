import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

// handles the login action. Provided as is by Auth0
const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button
      onClick={() => loginWithRedirect()}
      variant="primary"
      className="btn-margin login"
    >
      Admin Access
    </button>
  );
};

export default LoginButton;
