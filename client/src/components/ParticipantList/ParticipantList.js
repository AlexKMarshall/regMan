import React from 'react';
import { ParticipantItem } from '@/components';
import './ParticipantList.css';

const ParticipantList = ({ participants, promptPopup }) => {
  return (
    <div className="participants-list">
      <div className="participant-grid grid-header">
        <div className="grid-item grid-name grid-header-item">Name</div>
        <div className="grid-item grid-status-title grid-header-item">Status</div>
        <div className="grid-item grid-email grid-header-item">Email</div>
        <div className="grid-item grid-underage grid-header-item">Underage?</div>
        <div className="grid-item grid-instrument grid-header-item">Instrument</div>
        <div className="grid-item grid-delete grid-header-item">Delete</div>
      </div>
      <div className="list-container">
        {participants ? participants.map(participant => (
          <ParticipantItem
            key={'participant'+participant.id}
            participant={participant}
            promptPopup={promptPopup}
          />
        )) :
        (<h3>No one has registered yet.</h3>)
        }
      </div>

    </div>
  );
}

export default ParticipantList;
