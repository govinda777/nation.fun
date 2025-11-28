import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AgentDashboard from '../AgentDashboard';

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ agents: [{ id: '1', name: 'Test Agent', description: 'Test Description', status: 'active' }] }),
  })
);

describe('AgentDashboard', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('should render the loading state initially', () => {
    render(<AgentDashboard userId="test-user" />);
    expect(screen.getByText('Loading agents...')).toBeInTheDocument();
  });

  it('should render the dashboard with agents after a successful fetch', async () => {
    render(<AgentDashboard userId="test-user" />);
    await waitFor(() => {
      expect(screen.getByText('Test Agent')).toBeInTheDocument();
    });
  });

  it('should render the empty state if no agents are returned', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ agents: [] }),
      })
    );
    render(<AgentDashboard userId="test-user" />);
    await waitFor(() => {
      expect(screen.getByText('No agents yet. Create your first AI agent!')).toBeInTheDocument();
    });
  });

  it('should render the error state if the fetch fails', async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error('Failed to load agents')));
    render(<AgentDashboard userId="test-user" />);
    await waitFor(() => {
      expect(screen.getByText('Error Loading Dashboard')).toBeInTheDocument();
    });
  });

  it('should call onAgentCreate when the create button is clicked', async () => {
    const onAgentCreate = jest.fn();
    render(<AgentDashboard userId="test-user" onAgentCreate={onAgentCreate} />);
    const createButton = await screen.findByText('+ Create New Agent');
    await userEvent.click(createButton);
    expect(onAgentCreate).toHaveBeenCalled();
  });

  it('should switch themes based on the theme prop', () => {
    const { container } = render(<AgentDashboard userId="test-user" theme="dark" />);
    expect(container.firstChild).toHaveClass('agent-dashboard--dark');
  });
});
