import React, {useState, useEffect} from 'react';
import ApiClient from '@/services/ApiClient';
import {InstrumentList} from '@/components';
import { useAuth0 } from "@auth0/auth0-react";

const GroupsList = () => {
  const [instruments, setInstruments] = useState([]);
  const [attendants, setAttendants] = useState([]);
  const { getAccessTokenSilently } = useAuth0()

  useEffect(()=> {
    ApiClient.getInstruments()
      .then(instruments => setInstruments(instruments))
    getAccessTokenSilently()
      .then(token => ApiClient.getAllInscriptions(token))
      .then(inscriptions => setAttendants(inscriptions))
  }, [])

  return (
    <div>
      {(instruments && attendants) && instruments.map(instrument => (
        <div key={instrument._id}>
          <InstrumentList attendants={attendants.filter(attendant => attendant.instrument._id === instrument._id)} instrument={instrument} />
        </div>
      ))}
    </div>
  );
}

export default GroupsList;
