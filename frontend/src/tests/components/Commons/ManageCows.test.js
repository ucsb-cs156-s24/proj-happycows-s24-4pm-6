import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ManageCows from "main/components/Commons/ManageCows";
import userCommonsFixtures from "fixtures/userCommonsFixtures";
import { QueryClient, QueryClientProvider } from "react-query";

import * as currentUserModule from "main/utils/currentUser";

const queryClient = new QueryClient();

// Mock the useCurrentUser and hasRole functions
jest.mock("main/utils/currentUser", () => ({
    ...jest.requireActual("main/utils/currentUser"),
    useCurrentUser: jest.fn(),
    hasRole: jest.fn(),
}));
describe("ManageCows tests", () => {
    test("renders without crashing", () => {
        currentUserModule.useCurrentUser.mockReturnValue({
            data: {},
        });

        render(
            <QueryClientProvider client={queryClient}>
                <ManageCows
                    userCommons={userCommonsFixtures.oneUserCommons[0]}
                    onBuy={(userCommons) => {
                        console.log("onBuy called:", userCommons);
                    }}
                    onSell={(userCommons) => {
                        console.log("onSell called:", userCommons);
                    }}
                />
            </QueryClientProvider>
        );
    });

    test("buying and selling a cow", async () => {
        currentUserModule.useCurrentUser.mockReturnValue({
            data: {
                // Your mock data here
            },
        });
        const mockBuy = jest.fn();
        const mockSell = jest.fn();

        render(
            <QueryClientProvider client={queryClient}>
                <ManageCows
                    userCommons={userCommonsFixtures.oneUserCommons[0]}
                    onBuy={mockBuy}
                    onSell={mockSell}
                />
            </QueryClientProvider>
        );

        const buyButton = screen.getByTestId("buy-cow-button");
        const sellButton = screen.getByTestId("sell-cow-button");

        fireEvent.click(buyButton);
        await waitFor(() =>
            expect(mockBuy).toHaveBeenCalledWith(
                userCommonsFixtures.oneUserCommons[0]
            )
        );

        fireEvent.click(sellButton);
        await waitFor(() =>
            expect(mockSell).toHaveBeenCalledWith(
                userCommonsFixtures.oneUserCommons[0]
            )
        );
    });

    test("renders message for admin user with different ID", async () => {
        currentUserModule.useCurrentUser.mockReturnValue({
            data: {
                root: {
                    user: {
                        id: 123,
                    },
                },
            },
        });
        currentUserModule.hasRole.mockReturnValue(true);
        const mockBuy = jest.fn();
        const mockSell = jest.fn();

        render(
            <QueryClientProvider client={queryClient}>
                <ManageCows
                    userCommons={userCommonsFixtures.oneUserCommons[0]}
                    onBuy={mockBuy}
                    onSell={mockSell}
                    userId={1}
                />
            </QueryClientProvider>
        );

        await waitFor(() => {
            const messageElement = screen.getByTestId("ManageCows-ViewOnly");
            expect(messageElement).toBeInTheDocument();
            expect(messageElement).toHaveTextContent(
                "This page is for viewing only, cannot buy and sell cows."
            );
        });
        const buyButton = screen.queryByTestId("buy-cow-button");
        const sellButton = screen.queryByTestId("sell-cow-button");

        expect(buyButton).toBeNull();
        expect(sellButton).toBeNull();
        // expect(buyButton).toBeEnabled();
        // expect(sellButton).toBeEnabled();
    });
});
