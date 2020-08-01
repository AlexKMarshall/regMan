/*************************
 **  Attendant's Calls  **
 *************************/
function getAllInscriptions (token) {
  return fetchFromDb('inscriptions', {headers: {Authorization: `Bearer ${token}`}});
};

function getDetails (id, token) {
  return fetchFromDb(`inscriptions/${id}`, {headers: {Authorization: `Bearer ${token}`}})
};

function postNewAttendant (registration) {
  return fetchFromDb('inscriptions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(registration)
  });
};

function putDeleteAttendant (id, token) {
  return fetchFromDb(`inscriptions/delete/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
};

function putParticipantChanges (details, token) {
  return fetchFromDb(`inscriptions/update/${details.id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(details)
  })
};

/**********************
**  Payments' Calls  **
***********************/

function getAttendantPayments (id, token) {
  return fetchFromDb(`payments/${id}`, {headers: {Authorization: `Bearer ${token}`}})
};

function postNewPayment (payment, token) {
  return fetchFromDb('payments', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payment)
  })
};

function putUpdatePayment (payment, token) {
  return fetchFromDb(`payments/update/${payment.id}`,{
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payment)
  })
}

/**********************
**  Payments' Calls  **
***********************/

function getInstruments () {
  return fetchFromDb('instruments');
}

function putEditInstrument (instrument, token) {
  return fetchFromDb('instruments', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(instrument)
  })
}

/*********************
**  Fetch function  **
**********************/

async function fetchFromDb (url, options) {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/${url}`, options);
    const res_1 = res.status < 400 ? res : Promise.reject(res);
    return res_1.status !== 204 ? res_1.json() : res_1;
  }
  catch (err) {
    console.log(`Error fetching [${options && options.method}] ${url}: `, err);
    // <Redirect to={{pathname: '/error500', state: {error: err}}} />
  }
};

export default {
  getAllInscriptions,
  getDetails,
  postNewAttendant,
  putDeleteAttendant,
  putParticipantChanges,
  getAttendantPayments,
  postNewPayment,
  putUpdatePayment,
  getInstruments,
  putEditInstrument,
}