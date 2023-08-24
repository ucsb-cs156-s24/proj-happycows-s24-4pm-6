import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from "react-query";
import ChatPanel from 'main/components/Chat/ChatPanel';

describe('ChatPanel', () => {
    const commonsId = 1;

    const queryClient = new QueryClient();

    test('renders empty ChatMessageCreate and ChatDisplay', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <ChatPanel commonsId={commonsId} />
            </QueryClientProvider>
            );

        await waitFor(() => {
            expect(screen.getByTestId('ChatDisplay')).toBeInTheDocument();
        });

        expect(screen.getByTestId('ChatMessageCreate')).toBeInTheDocument();

        expect(screen.getByTestId('ChatPanel')).toHaveStyle('backgroundColor: white');
    });

});