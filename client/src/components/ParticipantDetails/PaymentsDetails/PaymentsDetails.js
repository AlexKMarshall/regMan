import React, { useEffect, useState } from 'react';
import ApiClient from '@app/services/ApiClient';
import { useAuth0 } from '@auth0/auth0-react';
import { PaymentItem, Popup, StatusLight } from '@app/components';
import './PaymentsDetails.css';

/**
 * Controls the payments' section of the code. It has a lot of code because it controls the
 * functionality for multiple popups.
 */
const PaymentsDetails = ({ details, setDetails, setDisplayEdit }) => {
  const [popupInfo, setPopupInfo] = useState({});
  const { getAccessTokenSilently } = useAuth0();
  // object with the sumary of the payments' status
  const [paymentDetails, setPaymentDetails] = useState({});

  // hides the edit buttons from the ParticipantDetails component.
  useEffect(() => {
    setDisplayEdit(false);
  }, []);

  useEffect(() => {
    if (details && details.payments) {
      const course_price = 60000;
      // reduces all the payments to find the total amount paid until the moment.
      const amount_paid = details.payments.reduce((acc, el) => {
        const value =
          el.type_of_payment === 'Refund' ? -el.amount_paid : +el.amount_paid;
        return acc + value;
      }, 0);
      const amount_due = course_price - amount_paid;
      let payment_status = 'pending';
      // Automatically changes the payment_status depending on the amount due/paid. This will, in turn, change the light indicator.
      amount_paid >= 6000 && (payment_status = 'downpayment');
      amount_due === 0 && (payment_status = 'payment complete');
      setPaymentDetails({
        course_price,
        amount_paid,
        amount_due,
        payment_status,
      });
    }
  }, [details]);

  // this function sets popupInfo, it is used to determine when to show a popup. It also combines
  // the different parameters passed to a popup to make them more manageable
  function promptPopup(info, type) {
    setPopupInfo({ info, type });
  }

  // resets popupInfo, effectively hiding the popup component.
  function cancelPopupAction() {
    setPopupInfo({});
  }

  // gets a token for the API calls and handles the different kind of results por popups.
  async function handlePopupAction(popupInfo) {
    const { info, type } = popupInfo;
    const token = await getAccessTokenSilently();
    switch (type) {
      // sets a new payment
      case 'Add Payment':
        info.amount_paid *= 100;
        ApiClient.postNewPayment(info, token)
          .then((newPayment) => {
            setDetails((details) => ({
              ...details,
              payments: [...details.payments, newPayment],
            }));
            return '';
          })
          .then(setPopupInfo({}));
        break;
      // stores the changes made to a payment
      case 'Save Payment':
        info.amount_paid *= 100;
        ApiClient.putUpdatePayment(info, token)
          .then((updatedPayment) => {
            setDetails((oldDetails) => {
              const newPayments = oldDetails.payments.filter(
                (payment) => payment.id !== updatedPayment.id
              );
              newPayments.push(updatedPayment);
              return { ...oldDetails, payments: newPayments };
            });
            return '';
          })
          .then(setPopupInfo({}));
        break;
      // calls sendPaymentStatus, which will trigger a function in the backend to send an email
      // to the attendant with his payment status.
      case 'Send Status':
        ApiClient.sendPaymentStatus(info, token).then(setPopupInfo({}));
        break;
      default:
        break;
    }
  }

  // variable that displays a popup when popupInfo has content.
  const popupBackground = Object.keys(popupInfo).length ? (
    <Popup
      popupInfo={popupInfo}
      cancelPopupAction={cancelPopupAction}
      handlePopupAction={handlePopupAction}
      setPopupInfo={setPopupInfo}
    />
  ) : (
    ''
  );

  return (
    <section id="payments">
      {/* displays popups */}
      {popupBackground}
      <div className="global-payment-status">
        <div className="status-information">
          <div className="payment status">
            <StatusLight status={paymentDetails.payment_status} />
            <p>
              Payment status: <b>{paymentDetails.payment_status}</b>
            </p>
          </div>
          <div className="payment-information">
            {/* All payment values are stored as integers to avoid decimal problems. They are transformed to decimals here */}
            <div className="payment course-price">
              Course price:{' '}
              {Number.parseFloat(paymentDetails.course_price / 100).toFixed(2) +
                ' €'}
            </div>
            <div className="payment amount-paid">
              Amount paid:{' '}
              {Number.parseFloat(paymentDetails.amount_paid / 100).toFixed(2) +
                ' €'}
            </div>
            <div className="payment amount-due">
              Amount due:{' '}
              <b>
                {Number.parseFloat(paymentDetails.amount_due / 100).toFixed(2) +
                  ' €'}
              </b>
            </div>
          </div>
        </div>
        <div className="payment-buttons">
          <div className="send-payment-status">
            {/* Button to prompt a popup. The properties passed are used in the backend to send emails.
            The second parameter is the type used in the switch statement above */}
            <button
              onClick={() =>
                promptPopup(
                  {
                    attendantId: details.id,
                    email: details.email,
                    first_name: details.first_name,
                  },
                  'Send Status'
                )
              }
            >
              Send payment status
            </button>
          </div>
          <div className="new-payment-button">
            {/* same as before. The id is used for the API route, the type_of_payment is used as a default value in the PopupMessage component */}
            <button
              onClick={() =>
                promptPopup(
                  {
                    attendantId: details.id,
                    type_of_payment: 'Payment',
                  },
                  'Add Payment'
                )
              }
            >
              Add new payment
            </button>
          </div>
        </div>
      </div>
      <div className="payment-grid grid-header">
        <div className="grid-item grid-header-item grid-date">Payment Date</div>
        <div className="grid-item grid-header-item grid-type-payment">
          Type of Payment
        </div>
        <div className="grid-item grid-header-item grid-amount">Amount</div>
      </div>
      <div className="payments-list">
        {
          // tripple check so that the app doesn't crash when looking for .length of undefined
          details && details.payments && details.payments.length ? (
            details.payments.map((payment) => (
              <PaymentItem
                key={'payment' + payment.id}
                payment={payment}
                promptPopup={promptPopup}
              />
            ))
          ) : (
            <h3 className="no-payments">There are no payments to display</h3>
          )
        }
      </div>
    </section>
  );
};

export default PaymentsDetails;
