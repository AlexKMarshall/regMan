import React from 'react';
import { render, screen } from '@testing-library/react';

import SmartLink from './SmartLink.tsx';

describe('SmartLink', () => {
  it('should render div "section-selectors" when isEditting is true', () => {
    render(<SmartLink isEditting={true} />);

    const sectionSelectorDiv = screen.getByTestId('section-selectors');
    expect(sectionSelectorDiv).toBeInTheDocument();
  });
});
