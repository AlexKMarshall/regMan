import React from 'react';
import moment from 'moment';
import './PaymentDetail.css'

const PaymentDetail = ({payment, promptPopup }) => {
  return (
    <div className="payment-detail" onClick={() => {
      const changedPayment = {...payment, amount_paid: payment.amount_paid/100}
      promptPopup(changedPayment, 'Save Payment')
    }}>
      <div>{moment(payment.payment_date).format('DD/MM/YYYY')}</div>
      <div>{payment.type_of_payment}</div>
      <div className={payment.type_of_payment === 'Refund' ? 'text-red' : ''}>{Number.parseFloat(payment.amount_paid/100).toFixed(2) + ' €'}</div>
    </div>
  );
}

export default PaymentDetail;
