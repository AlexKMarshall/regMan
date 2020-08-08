import React from 'react';
import { render } from '@test/test-utils';
import Dashboard from './Dashboard';
import { useAuth0 } from '@auth0/auth0-react';

jest.mock('@auth0/auth0-react');

test('can render dashboard with no error', () => {
  useAuth0.mockReturnValue({
    getAccessTokenSilently: jest.fn(() =>
      Promise.resolve({ token: 'a fake token' })
    ),
  });

  render(<Dashboard />);
});
