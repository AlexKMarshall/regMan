import React from 'react';
import { Link } from 'react-router-dom';

// Replaces react-router-dom's Link. If the content of the section isEditting, it will prompt an alert
// to save the changes before changing the section. Once the changes are saved, isEditting is set as false
// and the links will act normally.

interface Props {
  isEditting: boolean;
  match: {
    params: {
      id: string;
    };
  };
  to: string;
  value: string;
}

const SmartLink = ({ isEditting, match, to, value }: Props) => {
  if (isEditting) {
    return (
      <div
        data-testid="section-selectors"
        className="section-selectors"
        onClick={() =>
          alert('You have to save the changes before changing the section')
        }
      >
        <span>{value}</span>
      </div>
    );
  } else {
    return (
      <Link
        className="section-selectors"
        to={`/dashboard/details/${match.params.id}/${to}`}
      >
        {value}
      </Link>
    );
  }
};

export default SmartLink;
