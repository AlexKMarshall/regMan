import React from 'react';
import './EditButtons.css';
import { useLocation } from 'react-router-dom';

// Display component. Displays different buttons depending on the isEditting value. The button functionality
// is handled by the parent component. buttonFunctionality is an object containing the callback functions for each
// button interaction.

const EditButtons = ({ buttonFunctionality, isEditting }) => {
  const location = useLocation();
  const isPaymentRoute =
    location.pathname.search('payment') >= 0 ? true : false;
  const { editParticipant, cancelChanges, submitChanges } = buttonFunctionality;

  const buttons = isPaymentRoute
    ? null
    : [
        { name: 'Save changes', showOnEdit: true, onClick: submitChanges },
        { name: 'Edit contact', showOnEdit: false, onClick: editParticipant },
        { name: 'Cancel changes', showOnEdit: true, onClick: cancelChanges },
      ].map((button) => {
        if (button.showOnEdit === isEditting)
          return (
            <button key={button.name} onClick={button.onClick}>
              {button.name}
            </button>
          );
      });

  return (
    <div className="edit-buttons">
      <div>{buttons}</div>
    </div>
  );
};

export default EditButtons;
