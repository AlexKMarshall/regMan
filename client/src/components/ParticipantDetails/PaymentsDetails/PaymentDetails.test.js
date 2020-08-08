import React from 'react';
import { render } from '@testing-library/react';
import PaymentDetails from './PaymentDetails';

describe('PaymentDetails', () => {
  const details = {};
  const setDetails = jest.fn();

  it('should display date, type and amount of payment', () => {
    render(<PaymentDetails details={details} setDetails={setDetails} />);
  });
});
