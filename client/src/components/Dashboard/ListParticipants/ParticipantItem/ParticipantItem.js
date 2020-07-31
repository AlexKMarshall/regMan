import React from 'react';
import { StatusLight, DeleteParticipantButton } from '@/components';
import { Link } from 'react-router-dom'

const ParticipantItem = ({ participant, promptPopup }) => {
  return (
    <div className="participant-container">
      <div className="participant-grid">
        <Link to={`/dashboard/details/${participant.id}/personal`} className="grid-item grid-name">
          {participant.last_name}, {participant.first_name}
        </Link>
        <div className="grid-item grid-status-light">
          <StatusLight status={participant.registration_status} />
        </div>
        <div className="grid-item grid-status">{participant.registration_status}</div>
        <a className="grid-item grid-email" href={`mailto:${participant.email}`} target="_blank" rel="noopener noreferrer">
          {participant.email}
        </a>
        <div className="grid-item grid-underage">{participant.is_underage ? (<span role="img" aria-label="underage">🔞</span>) : (<span role="img" aria-label="underage">✅</span>)}</div>
        <div className="grid-item grid-instrument">{participant.instrument.name}</div>
        <div className="grid-item grid-delete">
          <DeleteParticipantButton info={participant} promptPopup={promptPopup} />
        </div>
      </div>
    </div>
  );
}

export default ParticipantItem;
