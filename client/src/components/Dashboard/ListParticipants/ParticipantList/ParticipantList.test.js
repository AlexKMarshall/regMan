import React from 'react';
import { render } from '@test/test-utils';
import ParticipantList from './ParticipantList';

describe('ParticipantList', () => {
  test('it should render without error', () => {
    render(<ParticipantList participants={[]} />);
  });
});
