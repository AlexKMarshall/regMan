import React from 'react';
import { NavLink } from 'react-router-dom';

const Confirmation = () => {
  return (
    <div>
      <h2>
        Thanks for your submision.
      </h2>
      <p>
        You'll receive an email with further instructions.
      </p>
      <p>
        Check your SPAM folder!
      </p>
      <NavLink to="/"><button>Go back to the form</button></NavLink>
    </div>
  );
}

export default Confirmation;
