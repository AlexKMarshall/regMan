import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import moment from 'moment';
import PaymentItem from './PaymentItem';

describe('PaymentItem', () => {
  const mockPrompt = jest.fn();
  const payment = {
    amount_paid: 500,
    payment_date: new Date(),
    type_of_payment: 'Payment',
  };
  const refund = {
    amount_paid: 500,
    payment_date: new Date(),
    type_of_payment: 'Refund',
  };

  it('should display date, type and amount of payment', () => {
    render(<PaymentItem payment={payment} promptPopup={mockPrompt} />);

    expect(
      screen.getByText(moment(payment.payment_date).format('DD/MM/YYYY'))
    ).toBeInTheDocument();
    expect(screen.getByText(payment.type_of_payment)).toBeInTheDocument();
    expect(
      screen.getByText(
        Number.parseFloat(payment.amount_paid / 100).toFixed(2) + ' €'
      )
    ).toBeInTheDocument();
  });

  it('should append the text-red class to the amount if type =Refund', () => {
    render(<PaymentItem payment={refund} promptPopup={mockPrompt} />);

    expect(
      screen.getByText(
        Number.parseFloat(payment.amount_paid / 100).toFixed(2) + ' €'
      )
    ).toHaveClass('text-red');
  });

  it('should open the Payment Popup on Click', () => {
    render(<PaymentItem payment={payment} promptPopup={mockPrompt} />);

    fireEvent.click(
      screen.getByText(moment(payment.payment_date).format('DD/MM/YYYY'))
    );
    fireEvent.click(screen.getByText(payment.type_of_payment));
    fireEvent.click(
      screen.getByText(
        Number.parseFloat(payment.amount_paid / 100).toFixed(2) + ' €'
      )
    );

    expect(mockPrompt).toHaveBeenCalledTimes(3);
  });
});
