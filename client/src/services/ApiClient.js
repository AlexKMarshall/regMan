/*************************
 **  Attendant's Calls  **
 *************************/

function getDetails(id, token) {
  return client(`inscriptions/${id}`, { token });
}

function postNewAttendant(registration) {
  return client('inscriptions', { data: registration });
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
  getDetails,
  getAttendantPayments,
  postNewAttendant,
  postNewPayment,
  putUpdatePayment,
  sendPaymentStatus,
  client,
};
