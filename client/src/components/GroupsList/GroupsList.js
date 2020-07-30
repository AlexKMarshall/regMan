import React from 'react';
import {InstrumentList} from '@/components';

const GroupsList = ({ participants, instruments, promptPopup}) => {
  return (
    <div>
      Hellooo!
      {console.log(instruments)}
      {(instruments && participants) && instruments.map(instrument => (
        <div key={'instrument'+instrument.id}>
          <InstrumentList
            participants={participants.filter(participant => participant.instrument.id === instrument.id)}
            instrument={instrument}
            promptPopup={promptPopup}
          />
        </div>
      ))}
    </div>
  );
}

export default GroupsList;
