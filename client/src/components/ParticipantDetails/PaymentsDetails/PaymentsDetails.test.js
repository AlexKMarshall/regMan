import React from 'react';
import {
  render,
  screen,
  cleanup,
  wait,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { buildPayments } from '@test/test-utils';
import PaymentsDetails from './PaymentsDetails';
import { Popup } from '@app/components';
import ApiClient from '@app/services/ApiClient';
import { useAuth0 } from '@auth0/auth0-react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import moment from 'moment';
import { server, rest } from '../../../test/server/test-server';

jest.mock('@auth0/auth0-react');

describe('PaymentsDetails', () => {
  const id = 4;

  ApiClient.sendPaymentStatus = jest.fn((info, token) => Promise.resolve(info));

  useAuth0.mockReturnValue({
    getAccessTokenSilently: jest.fn(() =>
      Promise.resolve({ token: 'a fake token' })
    ),
  });

  const payments = [...buildPayments({ number: 3 })];
  const details = { id: 4 };
  const detailsNoPayments = { id: 1 };

  it('should render buttons to send status and add new payment', async () => {
    await act(async () => {
      render(<PaymentsDetails details={details} />);
      await screen.findByTestId('payment-row0');
    });

    expect(
      screen.getByRole('button', { name: 'Send payment status' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Add new payment' })
    ).toBeInTheDocument();
  });

  it('should display a message, if no payments are retrieved', async () => {
    await act(async () => {
      render(<PaymentsDetails details={detailsNoPayments} />);
      await wait(() => screen.findByRole('heading', { name: /no payments/ }));
    });

    expect(
      screen.getByRole('heading', { name: /no payments/ })
    ).toBeInTheDocument();
  });

  it('should display the payments, that are retrieved', async () => {
    await act(async () => {
      render(<PaymentsDetails details={details} />);
      await screen.findByTestId('payment-row0');
    });

    expect(await screen.findByTestId('payment-row0')).toBeInTheDocument();
    expect(await screen.findByTestId('payment-row1')).toBeInTheDocument();
    expect(await screen.findByTestId('payment-row2')).toBeInTheDocument();
  });

  // Popup Buttons appear?
  const popUpButtons = [
    { name: 'Send payment status', testId: 'popup-send-status' },
    { name: 'Add new payment', testId: 'popup-add-payment' },
  ];
  popUpButtons.map((popup) => {
    it(`should open Popup to ${popup.name.toLowerCase()} upon click on right button`, async () => {
      await act(async () => {
        render(<PaymentsDetails details={details} />);
        await wait(() =>
          userEvent.click(screen.getByRole('button', { name: popup.name }))
        );
        await screen.findByTestId(popup.testId);
      });
      expect(await screen.findByTestId(popup.testId)).toBeInTheDocument();
    });
  });
  payments.map((payment) => {
    it(`should open Popup to edit Payment ${payment.id} upon click on payment ${payment.id} in table`, async () => {
      await act(async () => {
        await render(<PaymentsDetails details={details} />);
        await screen.findByTestId('payment-row' + payment.id);
        await wait(() =>
          userEvent.click(screen.getByTestId('payment-row' + payment.id))
        );
      });
      expect(
        await screen.findByTestId('popup-save-payment')
      ).toBeInTheDocument();
      cleanup();
    });
  });

  // Payment Details Functionality
  payments.map((payment) => {
    it(`should cancel Popup to edit Payment ${payment.id} upon click on Cancel Button`, async () => {
      await act(async () => {
        render(<PaymentsDetails details={details} />);
        await screen.findAllByTestId('payment-row' + payment.id);
        await wait(() =>
          userEvent.click(screen.getByTestId('payment-row' + payment.id))
        );
        await wait(async () =>
          userEvent.click(await screen.findByRole('button', { name: 'Cancel' }))
        );
      });
      expect(
        await screen.queryByTestId('popup-save-payment')
      ).not.toBeInTheDocument();
    });
  });

  //faulty
  payments.map((payment, index) => {
    it.skip(`should submit changed Data of Payment ${payment.id} to API`, async () => {
      await act(async () => {
        await render(<PaymentsDetails details={details} />);
        await screen.findByTestId('payment-row' + payment.id);
        await wait(() =>
          userEvent.click(screen.getByTestId('payment-row' + payment.id))
        );
        const amountValue = await screen.findByTestId('amount_paid');
        await wait(() => userEvent.type(amountValue, `${10 * (index + 1)}`));
        await wait(async () =>
          userEvent.click(
            await screen.getByRole('button', { name: 'Save Payment' })
          )
        );
        await wait(() => screen.getByTestId('payment-amount' + payment.id));
      });
      expect(
        screen.getByTestId('payment-amount' + payment.id)
      ).toBeInTheDocument();
    });
  });

  // Add new Payment
  it(`should open Popup to add Payment upon click on button`, async () => {
    await act(async () => {
      render(<PaymentsDetails details={details} />);
      await wait(() =>
        userEvent.click(screen.getByRole('button', { name: 'Add new payment' }))
      );
      await screen.findByTestId('popup-add-payment');
    });
    expect(await screen.findByTestId('popup-add-payment')).toBeInTheDocument();
  });

  it(`should submit new Payment to API`, async () => {
    await act(async () => {
      render(<PaymentsDetails details={details} />);
      await wait(() =>
        userEvent.click(screen.getByRole('button', { name: 'Add new payment' }))
      );
      await screen.findByTestId('popup-add-payment');
      const newDate = moment().subtract(5, 'day');
      await wait(() =>
        userEvent.selectOptions(screen.getByRole('combobox'), ['Payment'])
      );
      await wait(() =>
        userEvent.type(
          screen.getByLabelText('Payment date:'),
          newDate.format('YYYY-MM-DD')
        )
      );
      await wait(() => userEvent.type(screen.getByRole('spinbutton'), '51'));
      await wait(async () =>
        userEvent.click(
          await screen.findByRole('button', { name: 'Add Payment' })
        )
      );
      await screen.findAllByTestId('payment-row3');
    });
    expect(
      await screen.queryByTestId('popup-add-payment')
    ).not.toBeInTheDocument();
    expect(await screen.findAllByTestId('payment-row3')).toBeInTheDocument;
    // screen.debug();
    // expect(ApiClient.postNewPayment).toBeCalledTimes(1);
  });

  it(`should cancel Popup to add Payment upon click on button`, async () => {
    render(<PaymentsDetails details={details} />);

    await wait(() =>
      userEvent.click(screen.getByRole('button', { name: 'Add new payment' }))
    );
    await wait(async () =>
      userEvent.click(await screen.findByRole('button', { name: 'Cancel' }))
    );
    expect(
      await screen.queryByTestId('popup-add-payment')
    ).not.toBeInTheDocument();
  });

  // Send Status Button
  it(`should open Popup Dialog to send current payment status`, async () => {
    await act(async () => {
      render(<PaymentsDetails details={details} />);
      await wait(() =>
        userEvent.click(
          screen.getByRole('button', { name: 'Send payment status' })
        )
      );
      await screen.findByTestId('popup-send-status');
    });
    expect(await screen.findByTestId('popup-send-status')).toBeInTheDocument();
  });

  it(`should submit current Payment status to API`, async () => {
    await act(async () => {
      render(<PaymentsDetails details={details} />);
      await wait(() =>
        userEvent.click(
          screen.getByRole('button', { name: 'Send payment status' })
        )
      );
      await wait(async () =>
        userEvent.click(
          await screen.findByRole('button', { name: 'Send Status' })
        )
      );
    });
    expect(ApiClient.sendPaymentStatus).toBeCalledTimes(1);
  });

  it(`should cancel Popup Dialog upon click on Cancel`, async () => {
    await act(async () => {
      render(<PaymentsDetails details={details} />);

      await wait(() =>
        userEvent.click(
          screen.getByRole('button', { name: 'Send payment status' })
        )
      );
      await wait(async () =>
        userEvent.click(await screen.findByRole('button', { name: 'Cancel' }))
      );
    });

    expect(
      await screen.queryByTestId('popup-send-status')
    ).not.toBeInTheDocument();
  });
});
