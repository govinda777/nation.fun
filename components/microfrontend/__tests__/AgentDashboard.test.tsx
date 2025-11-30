import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AgentDashboard from '../AgentDashboard';

// Mock a successful fetch response
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ agents: [{ id: '1', name: 'Test Agent', description: 'A test agent', status: 'active' }] }),
  })
) as jest.Mock;

describe('AgentDashboard', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('renders loading state initially', () => {
    render(<AgentDashboard userId="test-user" />);
    expect(screen.getByText('Loading agents...')).toBeInTheDocument();
  });

  it('renders agents after a successful fetch', async () => {
    render(<AgentDashboard userId="test-user" />);
    await waitFor(() => {
      expect(screen.getByText('Test Agent')).toBeInTheDocument();
    });
  });

  it('renders an error message on fetch failure', async () => {
    (fetch as jest.Mock).mockImplementationOnce(() => Promise.reject(new Error('API Error')));
    const onError = jest.fn();
    render(<AgentDashboard userId="test-user" onError={onError} />);
    await waitFor(() => {
      expect(screen.getByText(/Failed to load agents/)).toBeInTheDocument();
      expect(onError).toHaveBeenCalled();
    });
  });
});
