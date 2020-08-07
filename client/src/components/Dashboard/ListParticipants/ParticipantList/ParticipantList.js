import React, { useCallback } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { ParticipantItem } from '@app/components';
import Switch from 'react-switch';
import './ParticipantList.css';
import { useMemo } from 'react';

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

function useSearchTerm() {
  const history = useHistory();
  const paramName = 'search';
  const location = useLocation();
  const params = new URLSearchParams(useLocation().search);

  const getSearchTerm = useCallback(() => {
    const params = new URLSearchParams(location.search);
    return params.get(paramName) ?? '';
  }, [location]);

  function setSearchTerm(value = '') {
    params.set(paramName, value);
    history.push(`?${params.toString()}`);
  }

  return [getSearchTerm(), setSearchTerm];
}

// Renders the list of attendants. It handles serches and filters for the list
const ParticipantList = ({ participants, promptPopup }) => {
  const [hideCancelled, setHideCancelled] = useHideCancelled();
  const [searchTerm, setSearchTerm] = useSearchTerm();

  function toggleHideCancelled() {
    const newValue = !hideCancelled;
    setHideCancelled(newValue);
  }

  const searchPredicate = useCallback(
    ({ first_name, last_name, registration_status, email, instrument }) => {
      const participantString = `${first_name}${last_name}${registration_status}${email}${instrument.name}`;
      const searchTermRegex = new RegExp(searchTerm, 'gi');
      return searchTerm ? searchTermRegex.test(participantString) : true;
    },
    [searchTerm]
  );

  const cancelFilterPredicate = useCallback(
    ({ registration_status }) => {
      return hideCancelled ? registration_status !== 'Cancelled' : true;
    },
    [hideCancelled]
  );

  const filteredParticipants = useMemo(() => {
    return participants.filter(searchPredicate).filter(cancelFilterPredicate);
  }, [participants, cancelFilterPredicate, searchPredicate]);

  function renderContent(content) {
    if (!participants.length) {
      return <h3>No one has registered yet.</h3>;
    } else if (searchTerm && !filteredParticipants.length) {
      return <h3>No matching records for your search</h3>;
    } else {
      return content;
    }
  }

  return (
    <div className="participants-list">
      <div className="search-and-filters">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onCancel={() => setSearchTerm('')}
        />
        <ToggleSwitch
          checked={hideCancelled}
          handleSwitch={toggleHideCancelled}
        />
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
        {renderContent(
          filteredParticipants.map((participant) => (
            <ParticipantItem
              key={'participant' + participant.id}
              participant={participant}
              promptPopup={promptPopup}
            />
          ))
        )}
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

function SearchBar({ value, onChange, onCancel }) {
  return (
    <div className="search-bar">
      <input
        className="search-input"
        placeholder="Search..."
        value={value}
        onChange={onChange}
      />
      <div
        className={'cancel-search' + (value === '' ? ' hidden' : '')}
        onClick={onCancel}
      >
        <span className="cancel-cross" role="img" aria-label="cancel search">
          ╳
        </span>
      </div>
    </div>
  );
}

export default ParticipantList;
