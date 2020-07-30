import React from 'react';
import {InstrumentList} from '@/components';

const GroupsList = ({ participants, instruments, promptPopup}) => {
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
        {(instruments && participants) && instruments.map(instrument => (
          <div key={'instrument'+instrument.id}>
            <InstrumentList
              participants={participants.filter(participant => participant.instrument.id === instrument.id)}
              instrument={instrument}
              promptPopup={promptPopup}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default GroupsList;
