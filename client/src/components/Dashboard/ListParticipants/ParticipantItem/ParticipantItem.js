import React from 'react';
import { StatusLight, DeleteParticipantButton } from '@app/components';
import { Link } from 'react-router-dom';

// list item for each participant. It links to the details component and prompts the deleteParticipantButton
const ParticipantItem = ({ participant, promptPopup }) => {
  return (
    <div className="participant-container">
      <div className="participant-grid" role="row">
        <div className="grid-item grid-name" role="cell">
          <Link to={`/dashboard/details/${participant.id}/personal`}>
            {participant.last_name}, {participant.first_name}
          </Link>
        </div>
        <div className="grid-item grid-status-light">
          <StatusLight status={participant.registration_status} />
        </div>
        <div className="grid-item grid-status">
          {participant.registration_status}
        </div>
        <a
          className="grid-item grid-email"
          href={`mailto:${participant.email}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {participant.email}
        </a>
        <div className="grid-item grid-underage">
          {participant.is_underage ? (
            <span role="img" aria-label="underage">
              🔞
            </span>
          ) : (
            <span role="img" aria-label="adult">
              ✅
            </span>
          )}
        </div>
        <div className="grid-item grid-instrument">
          {participant.instrument.name}
        </div>
        <div className="grid-item grid-delete">
          <DeleteParticipantButton
            info={participant}
            promptPopup={promptPopup}
          />
        </div>
      </div>
    </div>
  );
};

export default ParticipantItem;
