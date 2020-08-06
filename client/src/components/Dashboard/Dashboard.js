import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import ApiClient from '@app/services/ApiClient';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import './Dashboard.css';
import {
  Popup,
  ParticipantList,
  GroupsDisplay,
  ParticipantDetails,
  Navbar,
  Error500,
} from '@app/components';

// Acts as the main page for logged in users. It has its own router.
const Dashboard = () => {
  // array containing all the participants.
  const [participants, setParticipants] = useState([]);
  const [instruments, setInstruments] = useState([]);
  // controls the display of popups and the information they contain
  const [popupInfo, setPopupInfo] = useState({});
  // redirects to error500 if the API fails to connect.
  const [error, setError] = useState(false);
  // gets an authorisatin token from Auth0
  const { getAccessTokenSilently } = useAuth0();

  // gets an access token and fetches participants from the server. if the call fails, it'll display a 500 error
  useEffect(() => {
    getAccessTokenSilently()
      .then((token) => ApiClient.getAllInscriptions(token))
      .then((participants) => {
        if (participants.error) setError(true);
        else setParticipants(participants);
      });
    ApiClient.getInstruments().then((instruments) => {
      if (instruments.error) setError(true);
      else setInstruments(instruments);
    });
  }, []);

  // this function sets popupInfo, it is used to determine when to show a popup. It also combines
  // the different parameters passed to a popup to make them more manageable
  function promptPopup(info, type) {
    setPopupInfo({ info, type });
  }

  // resets popupInfo, effectively hiding the popup component.
  function cancelPopupAction() {
    setPopupInfo({});
  }

  // handles the functionality of the popups. Right now it only contains one case.
  // Built as a switch statement in case more popups had to be added in the future.
  // The functionality is identical to the popup handler in PaymentsDetails.
  // TODO: with redux, handle all popups from the same component to avoid repeated code.
  async function handlePopupAction(popupInfo) {
    const { info, type } = popupInfo;
    const token = await getAccessTokenSilently();
    switch (type) {
      case 'Delete':
        ApiClient.putDeleteAttendant(info.id, token).then(() => {
          setParticipants((participants) =>
            participants.filter((participant) => participant.id !== info.id)
          );
          setPopupInfo({});
        });
        break;
      default:
        break;
    }
  }

  // variable that displays a popup when popupInfo has content.
  const popupBackground = Object.keys(popupInfo).length ? (
    <Popup
      popupInfo={popupInfo}
      cancelPopupAction={cancelPopupAction}
      handlePopupAction={handlePopupAction}
    />
  ) : (
    ''
  );

  if (error) return <Redirect to={'/error500'} />;

  return (
    <div>
      {/* displays popups */}
      {popupBackground}
      <Router>
        {/* Navbar has to be inside the router when it's redirecting, otherwise it will render a white page because the route is not found.
        TODO: check out if there's better ways to implement nested routers. */}
        <Navbar />
        <div className="dashboard">
          <Route
            path="/dashboard/list"
            exact
            render={(props) => (
              <ParticipantList
                {...props}
                participants={participants}
                promptPopup={promptPopup}
              />
            )}
          />
          {/* Only participants who are not cancelled or on the waitlist get handled to the groups component for statistics. */}
          <Route
            path="/dashboard/groups"
            exact
            render={(props) => (
              <GroupsDisplay
                {...props}
                participants={participants.filter(
                  (participant) =>
                    participant.registration_status !== 'Cancelled' &&
                    participant.registration_status !== 'Waitlist'
                )}
                instruments={instruments}
                setInstruments={setInstruments}
              />
            )}
          />
          <Route
            path="/dashboard/details/:id/:section"
            exact
            render={(props) => (
              <ParticipantDetails
                {...props}
                setParticipants={setParticipants}
                instruments={instruments}
              />
            )}
          />
          <Route path="/error500" component={Error500} />
        </div>
      </Router>
    </div>
  );
};

export default Dashboard;
