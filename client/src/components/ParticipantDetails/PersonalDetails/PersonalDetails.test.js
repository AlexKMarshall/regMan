import React from 'react';
import { render, screen, buildInstrument } from '@test/test-utils';
import { useAuth0 } from '@auth0/auth0-react';
import { act } from 'react-dom/test-utils';
import PersonalDetails from './PersonalDetails';

jest.mock('@auth0/auth0-react');

describe('ParticipantDetails', () => {
  useAuth0.mockReturnValue({
    getAccessTokenSilently: jest.fn(() =>
      Promise.resolve({ token: 'a fake token' })
    ),
  });
  const props = {
    details: { id: 4 },
    instruments: [
      buildInstrument({ name: 'Fiddle' }),
      buildInstrument({ name: 'Cello' }),
    ],
    isEditting: false,
    handleChange: jest.fn(),
  };

  it('should disable input if !isEditting', async () => {
    await act(async () => {
      render(
        <PersonalDetails
          details={props.details}
          instruments={props.instruments}
          isEditting={props.isEditting}
          handleChange={props.handleChange}
        />
      );
      const textBoxes = await screen.getAllByRole('textbox');
      textBoxes.forEach((textBox) =>
        expect(textBox).toHaveAttribute(
          'class',
          `${!props.isEditting ? 'disabled' : ''}`
        )
      );
    });
  });
});
