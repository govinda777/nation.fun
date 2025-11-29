// components/__tests__/ChatWidget.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import fetchMock from 'fetch-mock-jest';
import ChatWidget from '../ChatWidget';

describe('ChatWidget', () => {
    afterEach(() => {
        fetchMock.restore();
    });

    it('renders with an initial message', () => {
        render(<ChatWidget initialMessage="Hello!" />);
        expect(screen.getByText('Hello!')).toBeInTheDocument();
    });

    it('updates the input value on change', () => {
        render(<ChatWidget />);
        const input = screen.getByPlaceholderText('Fale com nosso agente...');
        fireEvent.change(input, { target: { value: 'Test message' } });
        expect(input.value).toBe('Test message');
    });

    it('sends a message and displays the response', async () => {
        fetchMock.post('/api/chat', {
            choices: [{ message: { content: 'This is a test response.' } }],
        });

        render(<ChatWidget />);
        const input = screen.getByPlaceholderText('Fale com nosso agente...');
        const sendButton = screen.getByText('Enviar');

        fireEvent.change(input, { target: { value: 'Test message' } });
        fireEvent.click(sendButton);

        await waitFor(() => {
            expect(screen.getByText('Test message')).toBeInTheDocument();
            expect(screen.getByText('This is a test response.')).toBeInTheDocument();
        });
    });
});
