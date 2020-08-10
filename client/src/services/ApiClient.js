/*************************
 **  Attendant's Calls  **
 *************************/
function getAllInscriptions(token) {
  return fetchFromDb('inscriptions', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

function getDetails(id, token) {
  return fetchFromDb(`inscriptions/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

function postNewAttendant(registration) {
  return fetchFromDb('inscriptions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(registration),
  });
}

// The name is confusing. It's a put request that mimics the deletion of a record from the database.
// Records are not actually deleted, just not retrieved when getAll is called.
function putDeleteAttendant(id, token) {
  return fetchFromDb(`inscriptions/delete/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

function putParticipantChanges(details, token) {
  return fetchFromDb(`inscriptions/update/${details.id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(details),
  });
}

/**********************
 **  Payments' Calls  **
 ***********************/

function getAttendantPayments(id, token) {
  return fetchFromDb(`payments/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

function postNewPayment(payment, token) {
  return fetchFromDb('payments', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payment),
  });
}

function putUpdatePayment(payment, token) {
  return fetchFromDb(`payments/update/${payment.id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payment),
  });
}

function sendPaymentStatus(attendant, token) {
  return fetchFromDb('payments/sendStatus', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(attendant),
  });
}

/*************************
 **  Instruments' Calls  **
 **************************/

function getInstruments() {
  return client('instruments');
}

function updateInstruments(instruments, token) {
  return client('instruments', { method: 'PUT', data: instruments, token });
}

/*********************
 **  Fetch function  **
 **********************/

const apiUrl = process.env.REACT_APP_API_URL;

async function client(
  endpoint,
  { data, token, headers: customHeaders, ...customConfig } = {}
) {
  const config = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      'Content-Type': data ? 'application/json' : undefined,
      ...customHeaders,
    },
    ...customConfig,
  };

  return window
    .fetch(`${apiUrl}/${endpoint}`, config)
    .then(async (response) => {
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        return Promise.reject(data);
      }
    });
}

async function fetchFromDb(url, options) {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/${url}`, options);
    const res_1 = res.status < 400 ? res : Promise.reject(res);
    return res_1.status !== 204 ? res_1.json() : res_1;
  } catch (err) {
    console.log(`Error fetching [${options && options.method}] ${url}: `, err);
    return { error: true, err };
  }
}

export default {
  getAllInscriptions,
  getDetails,
  getAttendantPayments,
  getInstruments,
  postNewAttendant,
  postNewPayment,
  putDeleteAttendant,
  updateInstruments,
  putParticipantChanges,
  putUpdatePayment,
  sendPaymentStatus,
  client,
};
