import React from 'react';
import moment from 'moment';

/*
*  This component is comprised of a switch statement that selects the appropriate content of
*  the popup based on the type property of popupInfo. The info will then be sent to the
*  handler in the PopupComponent to be executed in their parent directory.
*  handleChange is a function that handles the change of information in the forms inside the popups.
*/

const PopupMessage = ({ popupInfo, setPopupInfo }) => {
  const { info, type } = popupInfo;

  function handleChange ({ target }) {
    info[target.name] = target.value;
    setPopupInfo(popupInfo => ({...popupInfo, info}))
  }

  const message = () => {
    switch (type) {
      // will prompt when attempting to delete a contact by the DeleteParticipantButton component.
      // It's just a verification to make sure that a record is not deleted accidentally
      case 'Delete':
        return (
          <div className="popup-text">
            {`Are you sure that you want to delete ${info.first_name} ${info.last_name}'${info.last_name[info.last_name.length - 1] === 's' ? '' : 's'} registration?`}
          </div>
        )
      // will prompt when creating a new payment from the new-payment-button in the PaymentsDetails component.
      // It creates a new payment in the database
      case 'Add Payment':
        return (
          <div className="form-section">
            <div className="description">
              <h3>Enter the payment details:</h3>
            </div>
            <div className="fields">
              <div className="field">
                <label htmlFor="payment_date">Payment date:</label>
                <input type="date" name="payment_date" defaultValue={moment().format('YYYY-MM-DD')} onChange={handleChange} required/>
              </div>
              <div className="field">
                <label htmlFor="type_of_payment">Select the type of payment:</label>
                <select name="type_of_payment" value={info.type_of_payment} onChange={handleChange} required>
                  <option value="Payment">Payment</option>
                  <option value="Refund">Refund</option>
                  <option value="Discount (5%)">Discount (5%)</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="amount_paid">Amount paid:</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder={info.type_of_payment === 'Discount (5%)' ? '30.00' : '0.00'}
                  disabled={info.type_of_payment === 'Discount (5%)' ? true : false}
                  className={info.type_of_payment === 'Discount (5%)' ? 'disabled' : ''}
                  name="amount_paid"
                  onChange={handleChange}
                  required
                  />
              </div>
            </div>
          </div>
        )

      // will be prompted when clicking on the PaymentItem component in the PaymensDetails.
      // It updates the contents of an existing payment.
      case 'Save Payment':
        return (
          <div className="form-section">
            <div className="description">
              <h3>Enter the payment details:</h3>
            </div>
            <div className="fields">
              <div className="field">
                <label htmlFor="payment_date">Payment date:</label>
                <input type="date" name="payment_date" value={moment(info.payment_date).format('YYYY-MM-DD')} onChange={handleChange} required/>
              </div>
              <div className="field">
                <label htmlFor="type_of_payment">Select the type of payment:</label>
                <select name="type_of_payment" value={info.type_of_payment} onChange={handleChange} required>
                  <option value="Payment">Payment</option>
                  <option value="Refund">Refund</option>
                  <option value="Discount (5%)">Discount (5%)</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="amount_paid">Amount paid:</label>
                <input
                  type="number"
                  step="0.01"
                  name="amount_paid"
                  value={Number.parseFloat(info.amount_paid).toFixed(2)}
                  disabled={info.type_of_payment === 'Discount (5%)' ? true : false}
                  className={info.type_of_payment === 'Discount (5%)' ? 'disabled' : ''}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
        )

      // Confirmation prompt. Will be called from the send-payment-status button in the PaymentsComponent.
      // will reach an endpoint in the API to send an email to the attendant with all his payments' records information.
      case 'Send Status':
        return (
          <div className="popup-text">
            {`Do you want to send the updated payment status to ${info.first_name} (${info.email})?`}
          </div>
        )
        default:
        break;
    }
  }

  return (
    <div>
      {message()}
    </div>
  );
}

export default PopupMessage;
