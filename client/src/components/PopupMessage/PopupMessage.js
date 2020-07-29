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
        return `Are you sure that you want to delete ${info.name} ${info.surname}'s registration?`
      case 'Add Payment':
        return (
          <div>
            <div>Enter the payment details:</div>
            <div>
              <label htmlFor="payment_date">Payment date:</label>
              <input type="date" name="payment_date" onChange={handleChange} required/>
            </div>
            <div>
              <label htmlFor="amount_paid">Amount paid:</label>
              <input type="number" step="0.01" placeholder="0.00" name="amount_paid" onChange={handleChange} required/>
            </div>
            <div>
              <label htmlFor="payment_kind">Select the type of payment:</label>
              <select name="payment_kind" onChange={handleChange} required>
                <option value="Payment">Payment</option>
                <option value="Refund">Refund</option>
              </select>
            </div>
          </div>
        )
      case 'Save Payment':
        return (
          <div>
            <div>Enter the payment details:</div>
            <div>
              <label htmlFor="payment_date">Payment date:</label>
              <input type="date" name="payment_date" value={moment(info.payment_date).format('YYYY-MM-DD')} onChange={handleChange} required/>
            </div>
            <div>
              <label htmlFor="amount_paid">Amount paid:</label>
              <input type="number" step="0.01" name="amount_paid" value={Number.parseFloat(info.amount_paid).toFixed(2)} onChange={handleChange} required/>
            </div>
            <div>
              <label htmlFor="payment_kind">Select the type of payment:</label>
              <select name="payment_kind" value={info.payment_kind} onChange={handleChange} required>
                <option value="Payment">Payment</option>
                <option value="Refund">Refund</option>
              </select>
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
