import React from 'react';
import moment from 'moment';
import './PaymentItem.css'

const PaymentItem = ({payment, promptPopup }) => {
  return (
    <div className="payment-detail">
      <div className="payment-detail payment-grid" onClick={() => {
        const changedPayment = {...payment, amount_paid: payment.amount_paid/100}
        promptPopup(changedPayment, 'Save Payment')
      }}>
        <div className="grid-item grid-date">{moment(payment.payment_date).format('DD/MM/YYYY')}</div>
        <div className="grid-item grid-type-payment">{payment.type_of_payment}</div>
        <div className={`grid-item grid-amount${payment.type_of_payment === 'Refund' ? ' text-red' : ''}`}>{Number.parseFloat(payment.amount_paid/100).toFixed(2) + ' €'}</div>
      </div>
    </div>
  );
}

export default PaymentItem;