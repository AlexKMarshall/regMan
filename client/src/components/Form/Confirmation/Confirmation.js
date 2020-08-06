import React from 'react';
import { NavLink } from 'react-router-dom';
import './Confirmation.css';
import { Navbar } from '@/components/';

const Confirmation = () => {
  return (
    <div>
      <Navbar />
      <div className="confirmation-container">
        <div className="confirmation">
          <div className="confirmation-text">
            <h2>Thank you for registering for our summer camp.</h2>
            <p>
              You'll receive an email from us with further instructions for your
              registration.
            </p>
            <p>
              If you don't receive our email in the following minutes, check
              your SPAM folder or get in touch with us.
            </p>
          </div>
          <div className="confirmation-button">
            <NavLink to="/">
              <button>Go back to the form</button>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
