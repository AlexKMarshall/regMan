import React, { useEffect, useState } from 'react';
import ApiClient from '@/services/ApiClient';
import { useAuth0 } from '@auth0/auth0-react';
import { PaymentItem, Popup, StatusLight } from '@/components';
import './DetailsFormPayments.css'

const DetailsFormPayments = ({ details, setDetails, setDisplayEdit }) => {
  const [popupInfo, setPopupInfo] = useState({});
  const { getAccessTokenSilently } = useAuth0();
  const [paymentDetails, setPaymentDetails] = useState({});

  useEffect(() => {
    setDisplayEdit(false)
  }, [])

  useEffect(() => {
    if (details && details.payments) {
      const course_price = 60000;
      const amount_paid = details.payments.reduce((acc, el) => {
        const value = el.type_of_payment === 'Payment' ? +el.amount_paid : -el.amount_paid;
        return acc + value;
      }, 0);
      const amount_due = course_price - amount_paid;
      let payment_status = 'pending';
      amount_paid >= 6000 && (payment_status = 'downpayment');
      amount_due === 0 && (payment_status = 'payment complete')
      setPaymentDetails({course_price, amount_paid, amount_due, payment_status});
    }
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
        info.amount_paid *= 100
        ApiClient.postNewPayment(info, token)
        .then(newPayment => {
          setDetails(details => ({...details, payments: [...details.payments, newPayment]}))
          return '';
        })
        .then(setPopupInfo({}))
        break;
      case 'Save Payment':
        info.amount_paid *= 100
        ApiClient.putUpdatePayment(info, token)
          .then(updatedPayment => {
            setDetails(oldDetails => {
              const newPayments = oldDetails.payments.filter(payment => payment.id !== updatedPayment.id)
              newPayments.push(updatedPayment)
              return {...oldDetails, payments: newPayments};
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
        <div className="status-information">
          <div className="payment status">
            <StatusLight status={paymentDetails.payment_status} />
            <p>Payment status: <b>{paymentDetails.payment_status}</b></p>
          </div>
          <div className="payment-information">
            <div className="payment course-price">Course price: {Number.parseFloat(paymentDetails.course_price/100).toFixed(2) + ' €'}</div>
            <div className="payment amount-paid">Amount paid: {Number.parseFloat(paymentDetails.amount_paid/100).toFixed(2) + ' €'}</div>
            <div className="payment amount-due">Amount due: <b>{Number.parseFloat(paymentDetails.amount_due/100).toFixed(2) + ' €'}</b></div>
          </div>
        </div>
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
      </div>
      <div className="payment-grid grid-header">
        <div className="grid-item grid-header-item grid-date">Payment Date</div>
        <div className="grid-item grid-header-item grid-type-payment">Type of Payment</div>
        <div className="grid-item grid-header-item grid-amount">Amount</div>
      </div>
      <div className="payments-list">
        {
          (details && details.payments && details.payments.length)
            ? details.payments.map(payment => (
              <PaymentItem
                key={'payment'+payment.id}
                payment={payment}
                promptPopup={promptPopup}
              />))
            : <h3 className="no-payments">There are no payments to display</h3>
        }
      </div>
    </section>
  );
}

export default DetailsFormPayments;
