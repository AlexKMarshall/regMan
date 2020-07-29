import React from 'react';

const DeleteParticipantButton = ({info, promptPopup}) => {

  return (
    <div>
      <button onClick={() => promptPopup(info, 'Delete')}><span role="img" aria-label="delete attendant record">🗑</span></button>
    </div>
  );
}

export default DeleteParticipantButton;
