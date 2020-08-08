import React from 'react';
import { render } from '@testing-library/react';
import PaymentsDetails from './PaymentsDetails';

describe('PaymentsDetails', () => {
  const details = {};
  const setDetails = jest.fn();

  it('should display date, type and amount of payment', () => {
    render(<PaymentsDetails details={details} setDetails={setDetails} />);
  });
});
