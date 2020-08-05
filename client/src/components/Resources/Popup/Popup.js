import React from 'react';
import './Popup.css'
import { PopupMessage } from '@/components';

/* Popups are divided in 2 components. All functionality is handled in their parent component.
*  CancelPopupAction will reset popupInfo to {}, cancelling the render in the parent component.
*  popupInfo is an object with the information that should be displayed in the popup. It will be rendered
*  by the PopupMessage component.
*  handlePopupAction is a handler function defined in the parent component that deals with the behaviour
*  of the popup "accept" button. The button will display the content of the 'type' property contained in
*  popupInfo. This property will also be read in the PopupMessage to determine the content of the message.
*
*  This way, the Popup & PopupMessage components are just displays of information, all the logic is handled
*  by their parent components.
*/

const Popup = ({cancelPopupAction, popupInfo, handlePopupAction, setPopupInfo}) => {

  return (
    <div className="popup-background">
      <div className="popup">
        <PopupMessage popupInfo={popupInfo} setPopupInfo={setPopupInfo} />
        <div className="popup-buttons">
          <button onClick={cancelPopupAction}>Cancel</button>
          <button onClick={() => handlePopupAction(popupInfo)}>{popupInfo.type}</button>
        </div>
      </div>
    </div>
  );
}

export default Popup;
