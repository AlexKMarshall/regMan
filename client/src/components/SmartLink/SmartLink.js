import React from 'react';
import { Link } from 'react-router-dom';

// Attempt to disable links based on current url and click events.

const SmartLink = ({isEditting, match, to, value}) => {
  if (match.url === `/dashboard/${match.params.id}/${to}`) {
    return (
      <div>
        <span>{value}</span>
      </div>
    )
  } else {

    if (isEditting) {
      return (
        <div onClick={() => alert("You have to save the changes before changing the section")}>
          <span>{value}</span>
        </div>
      )
    } else {
      return (
        <div>
          <Link to={`/dashboard/${match.params.id}/${to}`}>{value}</Link>
        </div>
      );
    }
  }

}

export default SmartLink;
