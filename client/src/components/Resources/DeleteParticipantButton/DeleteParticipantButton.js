import React from 'react';
import './DeleteParticipantButton.css'

// just displays the delete utton. When clicked it'll call the promptPopup function from the parent component passing the 'Delete'
// parameter to determine the content & functionality of the popup. Info is an object transmited from the parent component and
// used to identify the record to be deleted.

const DeleteParticipantButton = ({info, promptPopup}) => {
  return (
    <div>
      <button className="delete-btn" onClick={() => promptPopup(info, 'Delete')}><span role="img" aria-label="delete attendant record">🗑</span></button>
    </div>
  );
}

export default DeleteParticipantButton;
