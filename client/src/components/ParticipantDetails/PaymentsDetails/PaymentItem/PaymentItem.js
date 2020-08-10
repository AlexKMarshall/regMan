import React from 'react';
import moment from 'moment';
import './PaymentItem.css';

const PaymentItem = ({ payment, promptPopup }) => {
  return (
    <div className="payment-detail">
      {/*  A duplicate of the payment must be created in order to be able to cancel the changes in the popup*/}
      <div
        className="payment-detail payment-grid"
        data-testid={'payment-row' + payment.id}
        onClick={() => {
          const changedPayment = {
            ...payment,
            amount_paid: payment.amount_paid / 100,
          };
          promptPopup(changedPayment, 'Save Payment');
        }}
      >
        <div className="grid-item grid-date">
          {moment(payment.payment_date).format('DD/MM/YYYY')}
        </div>
        <div className="grid-item grid-type-payment">
          {payment.type_of_payment}
        </div>
        <div
          data-testid={'payment-amount' + payment.id}
          className={`grid-item grid-amount${
            payment.type_of_payment === 'Refund' ? ' text-red' : ''
          }`}
        >
          {Number.parseFloat(payment.amount_paid / 100).toFixed(2) + ' €'}
        </div>
      </div>
    </div>
  );
};

export default PaymentItem;
