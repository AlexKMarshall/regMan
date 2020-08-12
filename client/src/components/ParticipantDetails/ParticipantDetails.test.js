import React from 'react';
import { wait } from '@testing-library/react';
import {
  render,
  screen,
  buildParticipant,
  buildInstrument,
} from '@test/test-utils';
import ApiClient from '@app/services/ApiClient';
import { useAuth0 } from '@auth0/auth0-react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import moment from 'moment';
import { server, rest } from '../../test/server/test-server';
import ParticipantDetails from './ParticipantDetails';

jest.mock('@auth0/auth0-react');

describe('ParticipantDetails', () => {
  useAuth0.mockReturnValue({
    getAccessTokenSilently: jest.fn(() =>
      Promise.resolve({ token: 'a fake token' })
    ),
  });
  const match = {
    path: '/dashboard/details/:id/:section',
    url: '/dashboard/details/4/personal',
    isExact: true,
    params: {
      id: 4,
      section: 'personal',
    },
  };
  const instruments = [
    buildInstrument({ name: 'Fiddle' }),
    buildInstrument({ name: 'Cello' }),
  ];
  const setParticipants = jest.fn();

  it('should render links to Details sections for current Participant', async () => {
    await act(async () => {
      render(
        <ParticipantDetails
          match={match}
          instruments={instruments}
          setParticipants={setParticipants}
        />
      );
      await screen.findByText('Phil Dunphy');
    });

    expect(
      await screen.getByRole('link', { name: 'Personal Details' })
    ).toHaveAttribute('href', `/dashboard/details/${match.params.id}/personal`);
    expect(
      await screen.getByRole('link', { name: 'Health Details' })
    ).toHaveAttribute('href', `/dashboard/details/${match.params.id}/health`);
    expect(
      await screen.getByRole('link', { name: 'Payment Details' })
    ).toHaveAttribute('href', `/dashboard/details/${match.params.id}/payments`);
  });

  it('should show the Statuslight of the current Participant', async () => {
    await act(async () => {
      render(
        <ParticipantDetails
          match={match}
          instruments={instruments}
          setParticipants={setParticipants}
        />
      );
      await screen.findByText('Phil Dunphy');
    });

    expect(await screen.findByTestId('status-light')).toBeInTheDocument();
  });

  it('should show the Name of the current Participant', async () => {
    await act(async () => {
      render(
        <ParticipantDetails
          match={match}
          instruments={instruments}
          setParticipants={setParticipants}
        />
      );
      await screen.findByText('Phil Dunphy');
    });

    expect(await screen.findByText('Phil Dunphy')).toBeInTheDocument();
  });
});
