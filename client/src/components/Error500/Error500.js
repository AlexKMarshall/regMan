import React from 'react';

const Error500 = ({location}) => {
  const error = location.state.error;
  return (
    <div className="error">
      <h2>Error 500: Internal server error.</h2>
      <div>{error}</div>
      {console.log(error)}
    </div>
  );
}

export default Error500;
