import React from 'react';

const InstrumentList = ({attendants, instrument}) => {
  const participantCounter = attendants.length;
  return (
    <div>
      {instrument.name} {participantCounter} / {instrument.max_attendants}
      {attendants.map(attendant => {
        return (<div key={attendant._id}> {attendant.name} </div>)
      })}
      {console.log(participantCounter)}
    </div>
  );
}

export default InstrumentList;
