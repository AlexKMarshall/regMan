import React from 'react';
import { render, screen } from '@testing-library/react';

import App from '../App';

test('App should render without error', () => {
  render(<App />);
});
