import React from 'react';
import { StatusLight, DeleteParticipantButton } from '@/components';
import { Link } from 'react-router-dom'

const ParticipantItem = ({ participant, promptPopup }) => {
  return (
    <div className="participant">
      <StatusLight status={participant.registration_status} />
      <Link to={`/dashboard/details/${participant.id}/personal`}>
        {participant.last_name}, {participant.first_name}
      </Link>
      <a href={`mailto:${participant.email}`} target="_blank" rel="noopener noreferrer">
        {participant.email}
      </a>
      <div>{participant.is_underage ? (<span role="img" aria-label="underage">🔞</span>) : (<span role="img" aria-label="underage">✅</span>)}</div>
      <div>{participant.instrument.name}</div>
      <div>{participant.registration_status}</div>
      <DeleteParticipantButton info={participant} promptPopup={promptPopup} />
    </div>
  );
}

export default ParticipantItem;
