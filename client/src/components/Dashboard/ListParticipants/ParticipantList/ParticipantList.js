import React, { useState, useEffect } from 'react';
import { ParticipantItem } from '@/components';
import Switch from 'react-switch';
import './ParticipantList.css';

const ParticipantList = ({ participants, promptPopup }) => {
  const [checked, setChecked] = useState(localStorage.getItem('regmanCheckedFilter')? true : false);
  const [search, setSearch] = useState(localStorage.getItem('regmanSearch') ? localStorage.getItem('regmanSearch') : '');
  const [searchedParticipants, setSearchedParticipants] = useState([]);

  useEffect(() => {
    search
      ? setSearchedParticipants(participants.filter(participant => {
        const searchValue = ''.concat(participant.first_name, ' ', participant.last_name, ' ', participant.registration_status, ' ', participant.email, ' ', participant.instrument.name)
        return searchValue.toLowerCase().includes(search.toLowerCase())
      }))
      : setSearchedParticipants(participants);
  }, [participants]);

  useEffect(()=> {
    checked ? localStorage.setItem('regmanCheckedFilter', checked) : localStorage.removeItem('regmanCheckedFilter');
  },[checked])

  function handleSwitch(checked) {
    setChecked(checked)
  }

  function handleSearch({ target }) {
    setSearch(target.value);
    console.log('target value ',target.value)
    target.value ? localStorage.setItem('regmanSearch', target.value) : localStorage.removeItem('regmanSearch')
    setSearchedParticipants(participants.filter(participant => {
      const searchValue = ''.concat(participant.first_name, ' ', participant.last_name, ' ', participant.registration_status, ' ', participant.email, ' ', participant.instrument.name)
      return searchValue.toLowerCase().includes(target.value.toLowerCase())
    }))
  }

  function cancelSearch() {
    setSearch('');
    localStorage.removeItem('regmanSearch')
    setSearchedParticipants(participants);
  }

  function applyFilter () {
    return checked ? searchedParticipants.filter(participant => participant.registration_status !== 'Cancelled') : searchedParticipants
  }

  return (
    <div className="participants-list">
      <div className="search-and-filters">
        <div className="search-bar">
          <input className="search-input" placeholder="Search..." value={search} onChange={handleSearch} />
          {console.log(localStorage.getItem('regmanSearch'))}
          <div className={'cancel-search' + (search === '' ? ' hidden' : '')} onClick={cancelSearch}>
            <span className="cancel-cross" role="img" aria-label="cancel search">╳</span>
          </div>
        </div>
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
        {
          participants.length
          ? (searchedParticipants.length
            ? applyFilter().map(participant => (
              <ParticipantItem
                key={'participant'+participant.id}
                participant={participant}
                promptPopup={promptPopup}
              />
            ))
            : (<h3>No matching records for your search</h3>))
          : (<h3>No one has registered yet.</h3>)
        }
      </div>

    </div>
  );
}

export default ParticipantList;
