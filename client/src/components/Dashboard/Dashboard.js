import React, { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import ApiClient from '@/services/ApiClient';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import './Dashboard.css'
import {  Popup, ParticipantList, GroupsDisplay, ParticipantDetails, Navbar, Error500} from '@/components';

const Dashboard = () => {
  const [participants, setParticipants] = useState([]);
  const [instruments, setInstruments] = useState([]);
  const [popupInfo, setPopupInfo] = useState({});
  const [error, setError] = useState(false);

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    getAccessTokenSilently()
      .then(token => ApiClient.getAllInscriptions(token))
      .then(participants => {
        if(participants.error) setError(true);
        else setParticipants(participants)})
    ApiClient.getInstruments()
      .then(instruments => {
        if (instruments.error) setError(true);
        else setInstruments(instruments)})
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

  if (error) return (<Redirect to={'/error500'} />)

  return (
    <div>
      {popupBackground}
      <Router>
        <Navbar />
        <div className="dashboard">
          <Route path="/dashboard/list" exact render={(props) => (
            <ParticipantList
              {...props}
              participants={participants}
              promptPopup={promptPopup}
            />)}
          />
          <Route path="/dashboard/groups" exact render={(props) => (
            <GroupsDisplay
              {...props}
              participants={participants.filter(participant => participant.registration_status !== 'Cancelled')}
              instruments={instruments}
              setInstruments={setInstruments}
            />)}
          />
          <Route path="/dashboard/details/:id/:section" exact render={(props) => (
            <ParticipantDetails
              {...props}
              setParticipants={setParticipants}
              instruments={instruments}
            />)}
          />
          <Route path="/error500" component={Error500} />
        </div>
      </Router>
    </div>
  );
}

export default Dashboard;
