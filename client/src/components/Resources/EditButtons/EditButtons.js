import React from 'react';
import { Button } from '@app/components';
import './EditButtons.css';

// Display component. Displays different buttons depending on the isEditting value. The button functionality
// is handled by the parent component. buttonFunctionality is an object containing the callback functions for each
// button interaction.

const EditButtons = ({ buttonFunctionality, isEditting }) => {
  const { editParticipant, cancelChanges, submitChanges } = buttonFunctionality;

  const buttons = [
    { name: 'Save changes', showOnEdit: true, onClick: submitChanges },
    { name: 'Edit contact', showOnEdit: false, onClick: editParticipant },
    { name: 'Cancel changes', showOnEdit: true, onClick: cancelChanges },
  ].map((button) => {
    if (button.showOnEdit === isEditting)
      return (
        <Button key={button.name} name={button.name} onClick={button.onClick} />
      );
  });

  return (
    <div className="edit-buttons">
      <div>{buttons}</div>
    </div>
  );
};

export default EditButtons;
