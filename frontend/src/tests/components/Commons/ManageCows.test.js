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
            data: {
                // Your mock data here
            },
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
                        id: 123, // Replace with the desired id value for testing
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
                    commons={{ cowPrice: 10, milkPrice: 5 }}
                    onBuy={mockBuy}
                    onSell={mockSell}
                    userId={userCommonsFixtures.oneUserCommons[0].userId}
                />
            </QueryClientProvider>
        );

        const messageElement = screen.getByText(
            "This page is for viewing only, cannot buy and sell cows."
        );
        const buyButton = screen.queryByTestId("buy-cow-button");
        const sellButton = screen.queryByTestId("sell-cow-button");

        await waitFor(() => expect(messageElement).toBeInTheDocument());
        expect(buyButton).toBeNull();
        expect(sellButton).toBeNull();
    });
});
