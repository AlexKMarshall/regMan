import React, { useState, useEffect } from 'react';
import { ParticipantItem } from '@/components';
import Switch from 'react-switch';
import './ParticipantList.css';

const ParticipantList = ({ participants, promptPopup }) => {
  const [checked, setChecked] = useState(false);
  const [filteredParticipants, setFilteredParticipants ] = useState(participants);

  useEffect(() => {
    setFilteredParticipants(participants);
  }, [participants]);

  useEffect(() => {
    if(checked) {
      const notCancelled = participants.filter(participant => participant.registration_status !== 'Cancelled');
      setFilteredParticipants(notCancelled);
    } else {
      setFilteredParticipants(participants);
    }
  }, [checked])

  function handleSwitch(checked) {
    setChecked(checked)
  }

  return (
    <div className="participants-list">
      <div className="toggle-container">
      <label className="toggle-vertical-align">
        <span>Filter cancelled registrations: </span>
        <Switch
          onChange={handleSwitch}
          checked={checked}
          onColor="#f8d2ac"
          onHandleColor="#ff7900"
          handleDiameter={20}
          uncheckedIcon={false}
          checkedIcon={false}
          boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
          activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
          height={13}
          width={32}
        />
      </label>
      </div>
      <div className="participant-grid grid-header">
        <div className="grid-item grid-name grid-header-item">Name</div>
        <div className="grid-item grid-status-title grid-header-item">Status</div>
        <div className="grid-item grid-email grid-header-item">Email</div>
        <div className="grid-item grid-underage grid-header-item">Underage?</div>
        <div className="grid-item grid-instrument grid-header-item">Instrument</div>
        <div className="grid-item grid-delete grid-header-item">Delete</div>
      </div>
      <div className="list-container">
        {filteredParticipants ? filteredParticipants.map(participant => (
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
