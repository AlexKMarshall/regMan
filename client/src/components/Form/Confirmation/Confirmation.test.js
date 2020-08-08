import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import Confirmation from './Confirmation';

describe('Confirmation', () => {
  it('should show a thank you message', () => {
    render(
      <MemoryRouter>
        <Confirmation />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: /Thank you/ })
    ).toBeInTheDocument();
  });
});
