import React from 'react';
import moment from 'moment';
import './PaymentDetail.css'

const PaymentDetail = ({payment, promptPopup }) => {
  return (
    <div className="payment-detail" onClick={() => {
      const changedPayment = {...payment}
      promptPopup(changedPayment, 'Save Payment')
    }}>
      <div>{moment(payment.payment_date).format('DD/MM/YYYY')}</div>
      <div>{payment.payment_kind}</div>
      <div className={payment.payment_kind === 'Refund' ? 'text-red' : ''}>{Number.parseFloat(payment.amount_paid).toFixed(2) + ' €'}</div>
    </div>
  );
}

export default PaymentDetail;
