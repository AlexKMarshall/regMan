/*************************
 **  Attendant's Calls  **
 *************************/
function getAllInscriptions(token) {
  return client('inscriptions', { token });
}

function getDetails(id, token) {
  return client(`inscriptions/${id}`, { token });
}

function postNewAttendant(registration) {
  return client('inscriptions', { data: registration });
}

// The name is confusing. It's a put request that mimics the deletion of a record from the database.
// Records are not actually deleted, just not retrieved when getAll is called.
function putDeleteAttendant(id, token) {
  return client(`inscriptions/delete/${id}`, { method: 'PUT', token });
}

function putParticipantChanges(details, token) {
  return client(`inscriptions/update/${details.id}`, {
    method: 'PUT',
    token,
    data: details,
  });
}

/**********************
 **  Payments' Calls  **
 ***********************/

function getAttendantPayments(id, token, signal) {
  return client(`payments/${id}`, { token, ...signal });
}

function postNewPayment(payment, token) {
  return client('payments', { data: payment, token });
}

function putUpdatePayment(payment, token) {
  return client(`payments/update/${payment.id}`, {
    token,
    data: payment,
    method: 'PUT',
  });
}

function sendPaymentStatus(attendant, token) {
  return client('payments/sendStatus', {
    data: attendant,
    token,
  });
}

/*********************
 **  Fetch function  **
 **********************/

const apiUrl = process.env.REACT_APP_API_URL;

export async function client(
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

export default {
  getAllInscriptions,
  getDetails,
  getAttendantPayments,
  postNewAttendant,
  postNewPayment,
  putDeleteAttendant,
  putParticipantChanges,
  putUpdatePayment,
  sendPaymentStatus,
  client,
};
