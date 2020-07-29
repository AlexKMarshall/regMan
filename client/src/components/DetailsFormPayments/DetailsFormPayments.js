import React, { useEffect, useState } from 'react';
import ApiClient from '@/services/ApiClient';
import { useAuth0 } from '@auth0/auth0-react';
import { PaymentDetail, Popup, StatusLight } from '@/components';
import './DetailsFormPayments.css'

const DetailsFormPayments = ({ details, setDetails }) => {
  const [popupInfo, setPopupInfo] = useState({});
  const { getAccessTokenSilently } = useAuth0();

  function promptPopup (info, type) {
    setPopupInfo({info, type})
  }

  function cancelPopupAction () {
    setPopupInfo({})
  }

  async function handlePopupAction (popupInfo) {
    const { info, type } = popupInfo;
    const token = await getAccessTokenSilently()
    switch (type) {
      case 'Add Payment':
        ApiClient.postNewPayment(info, token)
          .then(newPayment => {
            setDetails(oldDetails => {
              const paymentValue = newPayment.type_of_payment === 'Payment' ? newPayment.amount_paid : -newPayment.amount_paid;
              const newDetails = {
                amount_paid: oldDetails.amount_paid + paymentValue,
                amount_due: oldDetails.amount_due - paymentValue,
                payments: [...oldDetails.payments, newPayment]
              }
              newDetails.amount_paid < 60 && (newDetails.payment_status = 'pending');
              newDetails.amount_paid >= 60 && (newDetails.payment_status = 'downpayment');
              newDetails.amount_due === 0 && (newDetails.payment_status = 'payment complete')
              const updatedDetails = {...oldDetails, ...newDetails}
              ApiClient.putParticipantChanges(updatedDetails, token)
              return updatedDetails
            })
            return '';
          })
          .then(setPopupInfo({}))
        break;
      case 'Save Payment':
        ApiClient.putUpdatePayment(info, token)
          .then(updatedPayment => {
            let oldValue = {};
            setDetails(oldDetails => {
              const updatedValue = updatedPayment.type_of_payment === 'Payment' ? updatedPayment.amount_paid : -updatedPayment.amount_paid;
              const oldPaymentValue = oldValue.type_of_payment === 'Payment' ? +oldValue.amount_paid : -oldValue.amount_paid;
              const newDetails = {
                amount_paid: oldDetails.amount_paid + updatedValue - oldPaymentValue,
                amount_due: oldDetails.amount_due - updatedValue + oldPaymentValue,
                payments: oldDetails.payments.filter(payment => payment.id !== updatedPayment.id).push(updatedPayment)
              }
              newDetails.amount_paid < 60 && (newDetails.payment_status = 'pending');
              newDetails.amount_paid >= 60 && (newDetails.payment_status = 'downpayment');
              newDetails.amount_due === 0 && (newDetails.payment_status = 'payment complete')
              const updatedDetails = {...oldDetails, ...newDetails}
              ApiClient.putParticipantChanges(updatedDetails, token)
              return updatedDetails;
            })
            return '';
          })
          .then(setPopupInfo({}))
        break;
      default:
        break;
    }
  }

  const popupBackground = Object.keys(popupInfo).length
    ? <Popup
        popupInfo={popupInfo}
        cancelPopupAction={cancelPopupAction}
        handlePopupAction={handlePopupAction}
        setPopupInfo={setPopupInfo}
      />
    : '';

  return (
    <section id="payments">
      {popupBackground}
      {console.log(details)}
      <div className="global-payment-status">
        <div className="payment status">
          <StatusLight status={details.payment_status} />
          <p>Payment status: <b>{details.payment_status}</b></p>
        </div>
        <div className="payment course-price">Course price: {Number.parseFloat(details.course_price/100).toFixed(2) + ' €'}</div>
        <div className="payment amount-paid">Amount paid: {Number.parseFloat(details.amount_paid/100).toFixed(2) + ' €'}</div>
        <div className="payment amount-due">Amount due: <b>{Number.parseFloat(details.amount_due/100).toFixed(2) + ' €'}</b></div>
      </div>
      <div className="payments-list">
        <div className="new-payment-button">
          <button
            onClick={()=> promptPopup({
              attendantId: details.id,
              type_of_payment: 'Payment'
            }, 'Add Payment')}
          >
            Add new payment
          </button>
        </div>
        {
          (details && details.payments.length)
            ? details.payments.map(payment => (
              <PaymentDetail
                key={'payment'+payment.id}
                payment={payment}
                promptPopup={promptPopup}
              />))
            : <div className="no-payments">There are no payments to display</div>
        }
      </div>
    </section>
  );
}

export default DetailsFormPayments;
