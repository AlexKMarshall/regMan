import React from 'react';
import {
  render,
  screen,
  waitFor,
  waitForElement,
} from '@testing-library/react';
import PaymentsDetails from './PaymentsDetails';
import { Popup } from '@app/components';
import ApiClient from '@app/services/ApiClient';
import { useAuth0 } from '@auth0/auth0-react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

jest.mock('@auth0/auth0-react');
jest.mock('@app/services/ApiClient');

describe('PaymentsDetails', () => {
  ApiClient.putUpdatePayment = jest.fn((info, token) => Promise.resolve(info));

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
        payment_date: new Date(),
      },
      {
        id: 2,
        type_of_payment: 'Refund',
        amount_paid: 60000,
        payment_date: new Date(),
      },
    ],
  };
  const detailsNoPayments = { payments: [] };
  const setDetails = jest.fn();

  it('should render buttons to send status and add new payment', () => {
    render(<PaymentsDetails details={details} setDetails={setDetails} />);

    expect(
      screen.getByRole('button', { name: 'Send payment status' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Add new payment' })
    ).toBeInTheDocument();
  });

  it('should display a message, if no payments are retrieved', () => {
    render(
      <PaymentsDetails details={detailsNoPayments} setDetails={setDetails} />
    );

    expect(
      screen.getByRole('heading', { name: /no payments/ })
    ).toBeInTheDocument();
  });
  it('should display the payments, that are retrieved', () => {
    render(<PaymentsDetails details={details} setDetails={setDetails} />);
    details.payments.map((payment) =>
      expect(screen.getByTestId('payment-row' + payment.id)).toBeInTheDocument()
    );
  });
  const popUpButtons = [
    { name: 'Send payment status', testId: 'popup-send-status' },
    { name: 'Add new payment', testId: 'popup-add-payment' },
  ];
  popUpButtons.map((popup) => {
    it(`should open Popup to ${popup.name.toLowerCase()} upon click on right button`, async () => {
      render(<PaymentsDetails details={details} setDetails={setDetails} />);

      userEvent.click(screen.getByRole('button', { name: popup.name }));
      expect(await screen.findByTestId(popup.testId)).toBeInTheDocument();
    });
  });
  details.payments.map((payment) => {
    it(`should open Popup to edit Payment ${payment.id} upon click on payment ${payment.id} in table`, async () => {
      render(<PaymentsDetails details={details} setDetails={setDetails} />);

      userEvent.click(screen.getByTestId('payment-row' + payment.id));

      expect(
        await screen.findByTestId('popup-save-payment')
      ).toBeInTheDocument();
    });
  });

  details.payments.map((payment) => {
    it(`should cancel Popup to edit Payment ${payment.id} upon click on Cancel Button`, async () => {
      render(<PaymentsDetails details={details} setDetails={setDetails} />);

      userEvent.click(screen.getByTestId('payment-row' + payment.id));
      userEvent.click(await screen.findByRole('button', { name: 'Cancel' }));
      expect(
        await screen.queryByTestId('popup-save-payment')
      ).not.toBeInTheDocument();
    });
  });

  details.payments.map((payment, index) => {
    it(`should submit changed Data of Payment ${payment.id} to API`, async () => {
      render(<PaymentsDetails details={details} setDetails={setDetails} />);

      userEvent.click(screen.getByTestId('payment-row' + payment.id));
      console.log(payment.amount_paid);
      await act(async () => {
        await userEvent.type(
          await screen.getByRole('spinbutton'),
          payment.amount_paid * 2
        );
        await userEvent.click(
          await screen.getByRole('button', { name: 'Save Payment' })
        );
      });
      expect(ApiClient.putUpdatePayment).toBeCalledTimes(index + 1);
    });
  });
});
