import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import ApiClient from '@/services/ApiClient';
import { Loading, DetailsFormHealth, DetailsFormPayments, DetailsFormPersonal, StatusLight } from '@/components';
import moment from 'moment';
import './ParticipantDetails.css'

const ParticipantDetails = ({ match }) => {
  const [details, setDetails] = useState({});
  const [oldDetails, setOldDetails] = useState({});
  const [isEditting, setIsEditting] = useState(false);
  const [sectionId, setSectionId] = useState('selector-personal')
  const [instruments, setInstruments] = useState([]);
  const { getAccessTokenSilently } = useAuth0();
  const id = match.params.id;
  const courseStarts = moment(process.env.REACT_APP_COURSE_START);

  useEffect(() => {
    getAccessTokenSilently()
      .then(token => ApiClient.getDetails(id, token))
      .then(details => {
        details.age = courseStarts.diff(details.date_birth, 'years');
        setDetails(details)
        setOldDetails(details)
      })
    ApiClient.getInstruments()
      .then(instruments => setInstruments(instruments))
  },[]);

  const buttonFunctionality = {
    editParticipant: () => {
      setIsEditting(!isEditting);
    },
    submitChanges: () => {
      getAccessTokenSilently()
      .then(token => ApiClient.putParticipantChanges(details, token))
      setOldDetails(details)
      setIsEditting(!isEditting);
    },
    cancelChanges: () => {
      setDetails(oldDetails);
      setIsEditting(!isEditting);
    }
  }

  function handleChange ({target}) {
    setDetails(oldDetails => ({...oldDetails, [target.name]: target.value}));
  }

  function handleAgeChange ({target}) {
    const newAge = courseStarts.diff(target.value, 'years')
    const newIsUnderage = newAge < 18 ? true : false;
    setDetails(oldDetails => ({
      ...oldDetails,
      date_birth: target.value,
      age: newAge,
      is_underage: newIsUnderage
    }))
  }

  const sectionSwitch = (param) => {
    switch (param) {
      case 'selector-personal':
        return (<DetailsFormPersonal
          details={details}
          isEditting={isEditting}
          instruments={instruments}
          handleChange={handleChange}
          handleAgeChange={handleAgeChange}
          buttonFunctionality={buttonFunctionality}
          />)
      case 'selector-health':
        return (<DetailsFormHealth
          details={details}
          isEditting={isEditting}
          handleChange={handleChange}
          buttonFunctionality={buttonFunctionality}
        />)
      case 'selector-payments':
        return (<DetailsFormPayments
          details={details}
          setDetails={setDetails}
        />)
      default:
        break;
    }
  }

  function handleSectionChange ({target}) {
    if (isEditting) return alert("You have to save the changes before changing the section")
    setSectionId(target.id);
  }

  const { isLoading } = useAuth0();
  if (isLoading || details === {} || instruments === []) return (<Loading/>)

  return (
    <div className="participant-details">
      <div className="header">
        <div className="displayed-information">
          <StatusLight status={details.registration_status} />
          <h3>{details.name} {details.surname}</h3>
        </div>
      </div>
      <div className="section-selectors">
        <div id="selector-personal" onClick={handleSectionChange}>Personal Details</div>
        <div id="selector-health" onClick={handleSectionChange}>Health</div>
        <div id="selector-payments" onClick={handleSectionChange}>Payments</div>
      </div>
      <div className="showcased-section">
        {sectionSwitch(sectionId)}
      </div>
    </div>
  );
}

export default ParticipantDetails;
