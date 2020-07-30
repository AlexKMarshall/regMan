import React from 'react';
import { ParticipantItem } from '@/components';

const ParticipantList = ({ participants, promptPopup }) => {
  return (
    <div className="participants-list">
      {participants && participants.map(participant => (
        <ParticipantItem
          className="participant-container"
          key={'participant'+participant.id}
          participant={participant}
          promptPopup={promptPopup}
        />
      ))}
    </div>
  );
}

export default ParticipantList;
