import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { ParticipantItem } from '@app/components';
import Switch from 'react-switch';
import './ParticipantList.css';

function useHideCancelled() {
  const history = useHistory();
  const paramName = 'hideCancelled';
  const location = useLocation();
  const params = new URLSearchParams(useLocation().search);

  const getHideCancelled = useCallback(() => {
    const params = new URLSearchParams(location.search);
    return params.get(paramName) === 'true';
  }, [location]);

  function setHideCancelled(value) {
    params.set(paramName, value);
    history.push(`?${params.toString()}`);
  }

  return [getHideCancelled(), setHideCancelled];
}

// Renders the list of attendants. It handles serches and filters for the list
const ParticipantList = ({ participants, promptPopup }) => {
  const [hideCancelled, setHideCancelled] = useHideCancelled();

  // search string. Stored in localstorage so that the search is not lost when moving between components.
  const [search, setSearch] = useState(
    localStorage.getItem('regmanSearch')
      ? localStorage.getItem('regmanSearch')
      : ''
  );
  // value displayed. All participants are filtered based on the search value. If '', all are shown.
  const [searchedParticipants, setSearchedParticipants] = useState([]);

  // populating initial values for searchedParticipants based on whether search exists in localstorage or not.
  useEffect(() => {
    search
      ? setSearchedParticipants(
          participants.filter((participant) => {
            const searchValue = ''.concat(
              participant.first_name,
              ' ',
              participant.last_name,
              ' ',
              participant.registration_status,
              ' ',
              participant.email,
              ' ',
              participant.instrument.name
            );
            return searchValue.toLowerCase().includes(search.toLowerCase());
          })
        )
      : setSearchedParticipants(participants);
  }, [participants]);

  // handles the switch component.
  function handleSwitch(checked) {
    const newValue = !hideCancelled;
    setHideCancelled(newValue);
  }

  // handles the search bar. Stores the search value in the localstorage and filters the participants.
  function handleSearch({ target }) {
    setSearch(target.value);
    target.value
      ? localStorage.setItem('regmanSearch', target.value)
      : localStorage.removeItem('regmanSearch');
    setSearchedParticipants(
      participants.filter((participant) => {
        const searchValue = ''.concat(
          participant.first_name,
          ' ',
          participant.last_name,
          ' ',
          participant.registration_status,
          ' ',
          participant.email,
          ' ',
          participant.instrument.name
        );
        return searchValue.toLowerCase().includes(target.value.toLowerCase());
      })
    );
  }

  // resets the search component.
  function cancelSearch() {
    setSearch('');
    localStorage.removeItem('regmanSearch');
    setSearchedParticipants(participants);
  }

  // applies the switch filter for rendering
  function applyFilter() {
    return hideCancelled
      ? searchedParticipants.filter(
          (participant) => participant.registration_status !== 'Cancelled'
        )
      : searchedParticipants;
  }

  return (
    <div className="participants-list">
      <div className="search-and-filters">
        <div className="search-bar">
          <input
            className="search-input"
            placeholder="Search..."
            value={search}
            onChange={handleSearch}
          />
          <div
            className={'cancel-search' + (search === '' ? ' hidden' : '')}
            onClick={cancelSearch}
          >
            <span
              className="cancel-cross"
              role="img"
              aria-label="cancel search"
            >
              ╳
            </span>
          </div>
        </div>
        {/* the switch component has to be inside a label. It needs to have all the css properties passed down as props... ¬_¬ */}
        <ToggleSwitch checked={hideCancelled} handleSwitch={handleSwitch} />
      </div>
      <div className="participant-grid grid-header">
        <div className="grid-item grid-name grid-header-item">Name</div>
        <div className="grid-item grid-status-title grid-header-item">
          Status
        </div>
        <div className="grid-item grid-email grid-header-item">Email</div>
        <div className="grid-item grid-underage grid-header-item">
          Underage?
        </div>
        <div className="grid-item grid-instrument grid-header-item">
          Instrument
        </div>
        <div className="grid-item grid-delete grid-header-item">Delete</div>
      </div>
      <div className="list-container">
        {
          // double ternary operator ^_^ have fun
          participants.length ? (
            searchedParticipants.length ? (
              applyFilter().map((participant) => (
                <ParticipantItem
                  key={'participant' + participant.id}
                  participant={participant}
                  promptPopup={promptPopup}
                />
              ))
            ) : (
              <h3>No matching records for your search</h3>
            )
          ) : (
            <h3>No one has registered yet.</h3>
          )
        }
      </div>
    </div>
  );
};

function ToggleSwitch({ checked, handleSwitch }) {
  return (
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
  );
}

export default ParticipantList;
