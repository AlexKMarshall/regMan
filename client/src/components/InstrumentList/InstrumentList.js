import React from 'react';
import { ParticipantItem } from '@/components';

const InstrumentList = ({participants, instrument, promptPopup}) => {
  const participantCounter = participants.length;
  return (
    <div>
      {instrument.name} {participantCounter} / {instrument.max_attendants}
      {participants.map(attendant => (
        <ParticipantItem participant={attendant} promptPopup={promptPopup}/>
      ))}
    </div>
  );
}

export default InstrumentList;
