import React from 'react';
import { ParticipantItem } from '@/components';

const InstrumentList = ({participants, instrument, promptPopup}) => {
  let participantCounter = 0;
  const filtered = participants.filter(person => person.registration_status !== 'Cancelled');
  participantCounter = filtered.length;
  return (
    <div>
      <div className="participant-grid grid-header">
        <div className="grid-item grid-name grid-header-item">
          {instrument.name}
        </div>
        <div className="grid-item grid-participants-total grid-header-item">
          Participants: {participantCounter} / {instrument.max_attendants}
        </div>
      </div>
      {participants.map(attendant => (
        <ParticipantItem key={'attendant'+attendant.id} participant={attendant} promptPopup={promptPopup}/>
      ))}
    </div>
  );
}

export default InstrumentList;
