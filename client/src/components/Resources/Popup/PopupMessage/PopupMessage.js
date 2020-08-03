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
          <div className="popup-text">
            {`Are you sure that you want to delete ${info.first_name} ${info.last_name}'${info.last_name[info.last_name.length - 1] === 's' ? '' : 's'} registration?`}
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
