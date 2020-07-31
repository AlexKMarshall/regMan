import React from 'react';
import moment from 'moment';

const PopupMessage = ({ popupInfo, setPopupInfo }) => {
  const { info, type } = popupInfo;

  function handleChange ({ target }) {
    info[target.name] = target.value;
    setPopupInfo(popupInfo => ({...popupInfo, info}))
  }

  const message = () => {
    switch (type) {
      case 'Delete':
        return (
          <div className="delete-confirmation">
            `Are you sure that you want to delete ${info.name} ${info.surname}'s registration?`
          </div>
        )
      case 'Add Payment':
        return (
          <div className="form-section">
            <div className="description">
              <h3>Enter the payment details:</h3>
            </div>
            <div className="fields">
              <div className="field">
                <label htmlFor="payment_date">Payment date:</label>
                <input type="date" name="payment_date" onChange={handleChange} required/>
              </div>
              <div className="field">
                <label htmlFor="type_of_payment">Select the type of payment:</label>
                <select name="type_of_payment" value={info.type_of_payment} onChange={handleChange} required>
                  <option value="Payment">Payment</option>
                  <option value="Refund">Refund</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="amount_paid">Amount paid:</label>
                <input type="number" step="0.01" placeholder="0.00" name="amount_paid" onChange={handleChange} required/>
              </div>
            </div>
          </div>
        )
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
                </select>
              </div>
              <div className="field">
                <label htmlFor="amount_paid">Amount paid:</label>
                <input type="number" step="0.01" name="amount_paid" value={Number.parseFloat(info.amount_paid).toFixed(2)} onChange={handleChange} required/>
              </div>
            </div>
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
