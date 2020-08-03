import React, { useState, useEffect } from 'react';
import { ParticipantItem } from '@/components';
import Switch from 'react-switch';
import './ParticipantList.css';

const ParticipantList = ({ participants, promptPopup }) => {
  const [checked, setChecked] = useState(localStorage.getItem('checkedFilter')? true : false);
  const [search, setSearch] = useState('');
  const [searchedParticipants, setSearchedParticipants] = useState([]);

  useEffect(() => {
    setSearchedParticipants(participants);
  }, [participants]);

  useEffect(()=> {
    checked ? localStorage.setItem('checkedFilter', checked) : localStorage.removeItem('checkedFilter');
  },[checked])

  function handleSwitch(checked) {
    setChecked(checked)
  }

  function handleSearch({ target }) {
    setSearch(target.value);
    setSearchedParticipants(participants.filter(participant => {
      const searchValue = ''.concat(participant.first_name, ' ', participant.last_name, ' ', participant.registration_status, ' ', participant.email, ' ', participant.instrument.name)
      return searchValue.toLowerCase().includes(target.value.toLowerCase())
    }))
  }

  function applyFilter () {
    return checked ? searchedParticipants.filter(participant => participant.registration_status !== 'Cancelled') : searchedParticipants
  }

  return (
    <div className="participants-list">
      <div className="search-and-filters">
        <input className="search-bar" placeholder="Search..." value={search} onChange={handleSearch}></input>
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
        {searchedParticipants ? applyFilter().map(participant => (
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
