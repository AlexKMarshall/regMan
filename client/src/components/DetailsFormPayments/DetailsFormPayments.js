import React, { useEffect, useState } from 'react';
import ApiClient from '@/services/ApiClient';
import { useAuth0 } from '@auth0/auth0-react';
import { PaymentDetail, Popup, StatusLight } from '@/components';
import './DetailsFormPayments.css'

const DetailsFormPayments = ({ details, setDetails }) => {
  const [payments, setPayments] = useState([]);
  const [popupInfo, setPopupInfo] = useState({});
  const { getAccessTokenSilently } = useAuth0();
  const id = details._id

  useEffect(() => {
    getAccessTokenSilently()
    .then(token => id && ApiClient.getAttendantPayments(id, token))
    .then(payments => setPayments(payments))
  }, [details]);

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
            setPayments(payments => [...payments, newPayment]);
            setDetails(oldDetails => {
              const paymentValue = newPayment.payment_kind === 'Payment' ? newPayment.amount_paid : -newPayment.amount_paid;
              const newDetails = {
                amount_paid: oldDetails.amount_paid + paymentValue,
                amount_due: oldDetails.amount_due - paymentValue,
                related_payments: [...oldDetails.related_payments, newPayment._id]
              }
              newDetails.amount_paid < 60 && (newDetails.payment_status = 'pending');
              newDetails.amount_paid >= 60 && (newDetails.payment_status = 'downpayment');
              newDetails.amount_due === 0 && (newDetails.payment_status = 'payment complete')
              const updatedDetails = {...oldDetails, ...newDetails}
              ApiClient.putParticipantChanges(updatedDetails, token)
              return {...oldDetails, ...newDetails}
            })
            return '';
          })
          .then(setPopupInfo({}))
        break;
      case 'Save Payment':
        ApiClient.putUpdatePayment(info, token)
          .then(updatedPayment => {
            let oldValue = {};
            setPayments(payments => {
              const newPaymentsArray = payments.filter(payment => {
                payment._id === updatedPayment._id && (oldValue = payment)
                return payment._id !== updatedPayment._id && payment
              });
              return newPaymentsArray.push(updatedPayment)
            });
            setDetails(oldDetails => {
              const updatedValue = updatedPayment.payment_kind === 'Payment' ? updatedPayment.amount_paid : -updatedPayment.amount_paid;
              const oldPaymentValue = oldValue.payment_kind === 'Payment' ? +oldValue.amount_paid : -oldValue.amount_paid;
              const newDetails = {
                amount_paid: oldDetails.amount_paid + updatedValue - oldPaymentValue,
                amount_due: oldDetails.amount_due - updatedValue + oldPaymentValue,
              }
              newDetails.amount_paid < 60 && (newDetails.payment_status = 'pending');
              newDetails.amount_paid >= 60 && (newDetails.payment_status = 'downpayment');
              newDetails.amount_due === 0 && (newDetails.payment_status = 'payment complete')
              const updatedDetails = {...oldDetails, ...newDetails}
              ApiClient.putParticipantChanges(updatedDetails, token)
              return {...oldDetails, ...newDetails}
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
      <div className="global-payment-status">
        <div className="payment status">
          <StatusLight status={details.payment_status} />
          <p>Payment status: <b>{details.payment_status}</b></p>
        </div>
        <div className="payment course-price">Course price: {Number.parseFloat(details.course_price).toFixed(2) + ' €'}</div>
        <div className="payment amount-paid">Amount paid: {Number.parseFloat(details.amount_paid).toFixed(2) + ' €'}</div>
        <div className="payment amount-due">Amount due: <b>{Number.parseFloat(details.amount_due).toFixed(2) + ' €'}</b></div>
      </div>
      <div className="payments-list">
        <div className="new-payment-button">
          <button onClick={()=> promptPopup({associated_attendant: details._id}, 'Add Payment')}>Add new payment</button>
        </div>
        {
          (payments && payments.length)
            ? payments.map(payment => (
              <PaymentDetail
                key={payment._id}
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
