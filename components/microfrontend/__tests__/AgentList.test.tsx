import React from 'react';
import { render, screen } from '@testing-library/react';
import AgentList from '../AgentList';

describe('AgentList', () => {
  it('should render the user ID and max items', () => {
    render(<AgentList userId="test-user" maxItems={10} />);
    expect(screen.getByText('Listing agents for user: test-user')).toBeInTheDocument();
    expect(screen.getByText('Maximum items: 10')).toBeInTheDocument();
  });
});
