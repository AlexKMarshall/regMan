import React from 'react';
import { render, screen } from '@testing-library/react';
import PaymentsDetails from './PaymentsDetails';
import { useAuth0 } from '@auth0/auth0-react';

jest.mock('@auth0/auth0-react');

describe('PaymentsDetails', () => {
  useAuth0.mockReturnValue({
    getAccessTokenSilently: jest.fn(() =>
      Promise.resolve({ token: 'a fake token' })
    ),
  });

  const details = {
    payments: [
      {
        id: 1,
        type_of_payment: 'Refund',
        amount_paid: 5000,
      },
      {
        id: 2,
        type_of_payment: 'Refund',
        amount_paid: 60000,
      },
    ],
  };
  const setDetails = jest.fn();

  it('should buttons to send status and add new payment', () => {
    render(<PaymentsDetails details={details} setDetails={setDetails} />);

    expect(
      screen.getByRole('button', { name: 'Send payment status' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Add new payment' })
    ).toBeInTheDocument();
  });
});
