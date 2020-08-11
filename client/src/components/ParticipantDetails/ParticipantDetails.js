import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import ApiClient from '@app/services/ApiClient';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import {
  Loading,
  HealthDetails,
  PaymentsDetails,
  PersonalDetails,
  StatusLight,
  SmartLink,
  EditButtons,
} from '@app/components';
import moment from 'moment';
import './ParticipantDetails.css';

/**
 * One of the main components. Has its own react-router to display the different details
 * of the attendant. isEditting is a boolean value that controls the edition in the page.
 * It locks the form when set as false and locks the links to other sections when set as true.
 * This property desn't affect the Dashboard and Groups links since they're in a separate component.
 * Will work on that in the future, or maybe when redux is in place.
 * Receives the match information form the Dashboard component, as well as instruments and
 * setParticipants (used to update the participants list with the new statuses.)
 */
const ParticipantDetails = ({ match, instruments, setParticipants }) => {
  // the properties of an attendant.
  const [details, setDetails] = useState({});
  // copy of the details so that changes can be undone upon cancellation.
  const [oldDetails, setOldDetails] = useState({});
  // boolean that controls edition in the page.
  const [isEditting, setIsEditting] = useState(false);
  // The paymentsDetails component doesn't need to edit the contact.
  // function that generates the token for authentication
  const { getAccessTokenSilently } = useAuth0();
  // the path will contain the id of the attendant we're looking into
  const id = match.params.id;
  // variable used to calculate the age of the participant.
  const courseStarts = moment(process.env.REACT_APP_COURSE_START);

  // getAccessTokenSilently gets the token used for authentication in the backend server
  useEffect(() => {
    getAccessTokenSilently()
      .then((token) => ApiClient.getDetails(id, token))
      .then((details) => {
        // the age is calculated when the course starts. There's an env variable setup to determine the date.
        details.age = courseStarts.diff(details.date_of_birth, 'years');
        setDetails({ ...details });
        setOldDetails({ ...details });
      });
  }, [getAccessTokenSilently, id, courseStarts]);

  // This object contains the functionality of the editButtons.
  const buttonFunctionality = {
    // allows edition.
    editParticipant: () => {
      setIsEditting(!isEditting);
    },

    // sends changes to the API, sets the changes into 'details' and updates the participants list in
    // the dashboard component in the proper order.
    submitChanges: () => {
      getAccessTokenSilently().then((token) =>
        ApiClient.putParticipantChanges(details, token)
      );
      setParticipants((oldList) => {
        const filtered = oldList.filter((attendant) => attendant.id !== +id);
        const complete = [...filtered, details];
        complete.sort((a, b) => {
          const sortA = a.last_name;
          const sortB = b.last_name;
          return sortA.localeCompare(sortB, 'es', {
            sensitivity: 'base',
            ignorePunctuation: true,
          });
        });
        return complete;
      });
      // updates oldDetails to match the new stored data.
      setOldDetails(details);
      setIsEditting(!isEditting);
    },
    cancelChanges: () => {
      setDetails(oldDetails);
      setIsEditting(!isEditting);
    },
  };

  // Handles change for the different details sections. When changing the date of birth
  // or the instrument, further adjustments have to be done to other properties.
  function handleChange({ target }) {
    switch (target.name) {
      case 'date_of_birth':
        const newAge = courseStarts.diff(target.value, 'years');
        setDetails((details) => ({
          ...details,
          date_of_birth: target.value,
          age: newAge,
          is_underage: newAge < 18,
        }));
        break;

      case 'instrumentId':
        const [instr] = instruments.filter(
          (instrument) => instrument.id === +target.value
        );
        setDetails((details) => ({
          ...details,
          instrumentId: target.value,
          instrument: instr,
        }));
        break;
      default:
        return setDetails((details) => ({
          ...details,
          [target.name]: target.value,
        }));
    }
  }

  const { isLoading } = useAuth0();
  if (isLoading || details === {} || instruments === []) return <Loading />;

  return (
    <div className="details-container">
      <div className="participant-details">
        <Router>
          <div className="details-header">
            <div className="displayed-information">
              <StatusLight status={details.registration_status} />
              <h3>
                {details.first_name} {details.last_name}
              </h3>
            </div>
          </div>
          <div className="details-nav">
            <div className="selectors-container">
              {/* SmartLink will prevent users from changing tabs without saving the changes */}
              <SmartLink
                to="personal"
                value="Personal Details"
                match={match}
                isEditting={isEditting}
              />
              <SmartLink
                to="health"
                value="Health Details"
                match={match}
                isEditting={isEditting}
              />
              <SmartLink
                to="payments"
                value="Payment Details"
                match={match}
                isEditting={isEditting}
              />
            </div>
            <div className="edit-buttons">
              <div>
                <EditButtons
                  isEditting={isEditting}
                  buttonFunctionality={buttonFunctionality}
                />
              </div>
            </div>
          </div>
          <div className="showcased-section">
            <Route
              path={`/dashboard/details/${match.params.id}/personal`}
              render={(props) => (
                <PersonalDetails
                  {...props}
                  details={details}
                  isEditting={isEditting}
                  instruments={instruments}
                  handleChange={handleChange}
                  buttonFunctionality={buttonFunctionality}
                />
              )}
            />
            <Route
              path={`/dashboard/details/${match.params.id}/health`}
              render={(props) => (
                <HealthDetails
                  {...props}
                  details={details}
                  isEditting={isEditting}
                  handleChange={handleChange}
                  buttonFunctionality={buttonFunctionality}
                />
              )}
            />
            <Route
              path={`/dashboard/details/${match.params.id}/payments`}
              render={(props) => (
                <PaymentsDetails
                  {...props}
                  details={details}
                  setDetails={setDetails}
                  id={id}
                />
              )}
            />
          </div>
        </Router>
      </div>
    </div>
  );
};

export default ParticipantDetails;
