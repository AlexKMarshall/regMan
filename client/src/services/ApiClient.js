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

// The name is confusing. It's a put request that mimics the deletion of a record from the database.
// Records are not actually deleted, just not retrieved when getAll is called.
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

function sendPaymentStatus(attendant, token) {
  return fetchFromDb('payments/sendStatus', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(attendant)
  })
}

/*************************
**  Instruments' Calls  **
**************************/

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
    return {error: true,  err}
  }
};

export default {
  getAllInscriptions,
  getDetails,
  getAttendantPayments,
  getInstruments,
  postNewAttendant,
  postNewPayment,
  putDeleteAttendant,
  putEditInstrument,
  putParticipantChanges,
  putUpdatePayment,
  sendPaymentStatus,
}