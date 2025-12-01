import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatWidget from '../ChatWidget.tsx'; // Importando o componente TSX

// Mock para o useChat hook para isolar o componente
jest.mock('@/hooks/useChat', () => ({
  useChat: () => ({
    messages: [],
    isLoading: false,
    error: null,
    sendMessage: jest.fn().mockResolvedValue(void 0), // Mock da função sendMessage
  }),
}));

describe('ChatWidget', () => {
    // Teste removido pois a lógica foi simplificada
    // it('renders with an initial message', () => {
    //     render(<ChatWidget initialMessage="Hello!" />);
    //     expect(screen.getByRole('textbox')).toHaveValue('Hello!');
    // });

    it('sends a message when the send button is clicked', async () => {
        const sendMessageMock = jest.fn().mockResolvedValue(void 0);
        jest.spyOn(require('@/hooks/useChat'), 'useChat').mockReturnValue({
            messages: [{ id: '1', role: 'user', content: 'Test message', timestamp: new Date() }],
            isLoading: false,
            error: null,
            sendMessage: sendMessageMock,
        });

        render(<ChatWidget />);

        const input = screen.getByPlaceholderText('Fale com nosso agente...');
        const sendButton = screen.getByText('Enviar');

        fireEvent.change(input, { target: { value: 'Test message' } });
        fireEvent.click(sendButton);

        await waitFor(() => {
            expect(sendMessageMock).toHaveBeenCalledWith('Test message');
        });

        // Verifica se o input foi limpo
        expect(input).toHaveValue('');
    });
});
