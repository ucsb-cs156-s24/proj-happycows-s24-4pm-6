import { fireEvent, render, screen } from "@testing-library/react";
import ManageCows from "main/components/Commons/ManageCows";

import userCommonsFixtures from "fixtures/userCommonsFixtures";
import { QueryClient, QueryClientProvider } from "react-query";
import { useParams } from "react-router-dom";
import * as currentUserModule from "main/utils/currentUser";

const queryClient = new QueryClient();

// Mock the useCurrentUser and hasRole functions
jest.mock("main/utils/currentUser", () => ({
    ...jest.requireActual("main/utils/currentUser"),
    useCurrentUser: jest.fn(),
    hasRole: jest.fn(),
}));
// mock useparams
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
}));
describe("ManageCows tests", () => {
    const mockSetMessage = jest.fn();
    const mockOpenModal = jest.fn();

    test("renders without crashing", () => {
        useParams.mockReturnValue({ userId: 1 }); // Replace with your desired mock values

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

    test("renders message when admin visit other pages", async () => {
        useParams.mockReturnValue({ userId: 1 }); // Replace with your desired mock values

        currentUserModule.useCurrentUser.mockReturnValue({
            data: {
                root: {
                    user: {
                        id: 1,
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

        const messageElement = screen.getByTestId("ManageCows-ViewOnly");
        expect(messageElement).toBeInTheDocument();
        expect(messageElement).toHaveTextContent(
            "This page is for viewing only, cannot buy and sell cows."
        );

        const buyButton = screen.queryByTestId("buy-cow-button");
        const sellButton = screen.queryByTestId("sell-cow-button");

        expect(buyButton).toBeNull();
        expect(sellButton).toBeNull();
    });

    test('calls setMessage with "buy" when the buy button is clicked', () => {
        useParams.mockReturnValue({ userId: undefined }); // Replace with your desired mock values

        currentUserModule.useCurrentUser.mockReturnValue({
            data: {
                root: {
                    user: {
                        id: NaN,
                    },
                },
            },
        });
        currentUserModule.hasRole.mockReturnValue(true);
        render(
            <QueryClientProvider client={queryClient}>
                <ManageCows
                    userCommons={userCommonsFixtures.oneUserCommons[0]}
                    setMessage={mockSetMessage}
                    openModal={mockOpenModal}
                />
            </QueryClientProvider>
        );

        fireEvent.click(screen.getByTestId("buy-cow-button"));
        expect(mockSetMessage).toHaveBeenCalledWith("buy");
        expect(mockOpenModal).toHaveBeenCalled();
    });

    test('calls setMessage with "sell" when the sell button is clicked', () => {
        useParams.mockReturnValue({ userId: undefined }); // Replace with your desired mock values

        currentUserModule.useCurrentUser.mockReturnValue({
            data: {
                root: {
                    user: {
                        id: NaN,
                    },
                },
            },
        });
        currentUserModule.hasRole.mockReturnValue(true);
        render(
            <QueryClientProvider client={queryClient}>
                <ManageCows
                    userCommons={userCommonsFixtures.oneUserCommons[0]}
                    setMessage={mockSetMessage}
                    openModal={mockOpenModal}
                />
            </QueryClientProvider>
        );

        fireEvent.click(screen.getByTestId("sell-cow-button"));
        expect(mockSetMessage).toHaveBeenCalledWith("sell");
        expect(mockOpenModal).toHaveBeenCalled();
    });
});
