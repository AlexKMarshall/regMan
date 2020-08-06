import React from 'react';
import { Navbar } from '@/components';

const Error500 = () => {
  return (
    <div>
      <Navbar />
      <div className="error">
        <h2>Error 500: Internal server error.</h2>
        <a href="/">
          <button>Back to the form</button>
        </a>
      </div>
    </div>
  );
};

export default Error500;
