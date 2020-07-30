import React, { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import ApiClient from '@/services/ApiClient';
import { Link } from 'react-router-dom';
import './Dashboard.css'
import { DeleteParticipantButton, Popup } from '@/components';
import StatusLight from '../StatusLight';

const Dashboard = () => {
  const [participants, setParticipants] = useState([]);
  const [popupInfo, setPopupInfo] = useState({});
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    getAccessTokenSilently()
      .then(token => ApiClient.getAllInscriptions(token))
      .then(participants => setParticipants(participants))
  }, []);

  function promptPopup (info, type) {
    setPopupInfo({info, type})
  }

  function cancelPopupAction () {
    setPopupInfo({})
  }

  async function handlePopupAction (popupInfo) {
    const { info, type } = popupInfo;
    const token = await getAccessTokenSilently()
    switch (type) {
      case 'Delete':
        ApiClient.putDeleteAttendant(info.id, token)
          .then(() => {
            setParticipants(participants => (
              participants.filter(participant => participant.id !== info.id)
            ));
            setPopupInfo({});
          })
        break;
      default:
        break;
    }
  }

  const popupBackground = Object.keys(popupInfo).length
    ? <Popup
        popupInfo={popupInfo}
        cancelPopupAction={cancelPopupAction}
        handlePopupAction={handlePopupAction}
      />
    : '';

  return (
    <div className="list">
      {popupBackground}
      {participants.map(participant => (
        <div className="participant-container" key={'participant'+participant.id}>
          <div className="participant">
            <StatusLight status={participant.registration_status} />
            <Link to={`/dashboard/${participant.id}/personal`}>
              {participant.last_name}, {participant.first_name}
            </Link>
            <a href={`mailto:${participant.email}`} target="_blank" rel="noopener noreferrer">
              {participant.email}
            </a>
            <div>{participant.is_underage ? (<span role="img" aria-label="underage">🔞</span>) : (<span role="img" aria-label="underage">✅</span>)}</div>
            <div>{participant.instrument.name}</div>
            <div>{participant.registration_status}</div>
            <DeleteParticipantButton info={participant} promptPopup={promptPopup} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
