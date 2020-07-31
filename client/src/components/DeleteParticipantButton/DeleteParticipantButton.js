import React from 'react';
import './DeleteParticipantButton.css'

const DeleteParticipantButton = ({info, promptPopup}) => {

  return (
    <div>
      <button className="delete-btn" onClick={() => promptPopup(info, 'Delete')}><span role="img" aria-label="delete attendant record">🗑</span></button>
    </div>
  );
}

export default DeleteParticipantButton;
