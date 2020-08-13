import React, { useState } from 'react';
import {
  useInstruments,
  useUpdateInstruments,
} from '@app/services/instruments';
import {
  useParticipants,
  useUpdateParticipant,
  useDeleteParticipant,
} from '@app/services/participants';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './Dashboard.css';
import {
  Popup,
  ParticipantList,
  GroupsDisplay,
  ParticipantDetails,
  Navbar,
  Error500,
} from '@app/components';
import Loading from '../Resources/Loading';

// Acts as the main page for logged in users. It has its own router.
const Dashboard = () => {
  // controls the display of popups and the information they contain
  const [popupInfo, setPopupInfo] = useState({});

  const { instruments, ...instrumentsQuery } = useInstruments();

  const [updateInstruments] = useUpdateInstruments();

  async function onUpdateInstruments({ instruments }) {
    try {
      await updateInstruments({ instruments });
    } catch (error) {
      console.log(`error saving instruments ${instruments}`);
    }
  }

  const { participants, ...participantsQuery } = useParticipants();

  const [updateParticipant] = useUpdateParticipant();

  async function onUpdateParticipant({ participant }) {
    try {
      await updateParticipant({ participant });
    } catch (error) {
      console.log(`error saving participant ${participant}`);
    }
  }

  const [deleteParticipant] = useDeleteParticipant();

  async function onDeleteParticipant({ participantId }) {
    try {
      await deleteParticipant({ participantId });
    } catch (error) {
      console.log(`error deleting participant id ${participantId}`);
    }
  }

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
    switch (type) {
      case 'Delete':
        const participantId = info.id;
        await onDeleteParticipant({ participantId });
        setPopupInfo({});
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

  if (instrumentsQuery.isLoading || participantsQuery.isLoading)
    return <Loading />;
  if (instrumentsQuery.error || participantsQuery.error)
    return `Error ${instrumentsQuery.error} ${participantsQuery.error}`;

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
                onUpdateInstruments={onUpdateInstruments}
              />
            )}
          />
          <Route
            path="/dashboard/details/:id/:section"
            exact
            render={(props) => (
              <ParticipantDetails
                {...props}
                instruments={instruments}
                onUpdateParticipant={onUpdateParticipant}
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
