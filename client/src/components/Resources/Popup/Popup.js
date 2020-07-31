import React from 'react';
import './Popup.css'
import { PopupMessage } from '@/components';
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
