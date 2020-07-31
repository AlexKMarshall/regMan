import React, { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import ApiClient from '@/services/ApiClient';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './Dashboard.css'
import {  Popup, ParticipantList, GroupsList, ParticipantDetails, Navbar } from '@/components';

const Dashboard = () => {
  const [participants, setParticipants] = useState([]);
  const [instruments, setInstruments] = useState([]);
  const [popupInfo, setPopupInfo] = useState({});
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    getAccessTokenSilently()
      .then(token => ApiClient.getAllInscriptions(token))
      .then(participants => setParticipants(participants))
    ApiClient.getInstruments()
      .then(instruments => setInstruments(instruments))
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
    <div>
      {popupBackground}
      <Router>
        <Navbar />
        <Route path="/dashboard/list" exact render={(props) => (
          <ParticipantList
            {...props}
            participants={participants}
            promptPopup={promptPopup}
          />)}
        />
        <Route path="/dashboard/groups" exact render={(props) => (
          <GroupsList
            {...props}
            participants={participants}
            instruments={instruments}
            promptPopup={promptPopup}
          />)}
        />
        <Route path="/dashboard/details/:id/:section" render={(props) => (
          <ParticipantDetails
            {...props}
            participants={participants}
            setParticipants={setParticipants}
            instruments={instruments}

          />)}
        />
      </Router>
    </div>
  );
}

export default Dashboard;
