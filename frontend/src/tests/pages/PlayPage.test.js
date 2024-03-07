import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import PlayPage from "main/pages/PlayPage";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: () => ({
        commonsId: 1
    })
}));

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

describe("PlayPage tests", () => {
    const axiosMock = new AxiosMockAdapter(axios);
    const queryClient = new QueryClient();

    beforeEach(() => {
        const userCommons = {
            commonsId: 1,
            id: 1,
            totalWealth: 0,
            userId: 1,
            showChat: true
        };
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
        axiosMock.onGet("/api/usercommons/forcurrentuser", { params: { commonsId: 1 } }).reply(200, userCommons);
        axiosMock.onGet("/api/commons", { params: { id: 1 } }).reply(200, {
            id: 1,
            name: "Sample Commons"
        });
        axiosMock.onGet("/api/commons/all").reply(200, [
            {
                id: 1,
                name: "Sample Commons"
            }
        ]);
        axiosMock.onGet("/api/commons/plus", { params: { id: 1 } }).reply(200, {
            commons: {
                id: 1,
                name: "Sample Commons",
                showChat: true
            },
            totalPlayers: 5,
            totalCows: 5 
        });
        axiosMock.onGet("/api/profits/all/commonsid").reply(200, []);
        axiosMock.onPut("/api/usercommons/sell").reply(200, userCommons);
        axiosMock.onPut("/api/usercommons/buy").reply(200, userCommons);
    });

    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <PlayPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("click buy button", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <PlayPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(await screen.findByTestId("buy-cow-button")).toBeInTheDocument();
        const buyCowButton = screen.getByTestId("buy-cow-button");
        fireEvent.click(buyCowButton);

        const modal_buy = screen.findByTestId("buy-sell-cow-modal")
        expect(await modal_buy).toBeInTheDocument();
        const submitModalButton = screen.getByTestId("buy-sell-cow-modal-submit")
        fireEvent.click(submitModalButton)

        await waitFor(() => expect(axiosMock.history.put.length).toBe(1));
    });

    test("click sell button", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <PlayPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(await screen.findByTestId("sell-cow-button")).toBeInTheDocument();
        const sellCowButton = screen.getByTestId("sell-cow-button");
        fireEvent.click(sellCowButton);

        const modal_sell = screen.findByTestId("buy-sell-cow-modal");
        expect(await modal_sell).toBeInTheDocument();
        const submitModalButton = screen.getByTestId("buy-sell-cow-modal-submit");
        fireEvent.click(submitModalButton);

        expect(await modal_sell).not.toBeInTheDocument();

        await waitFor(() => expect(axiosMock.history.put.length).toBe(1));
    });

    test("Make sure that both the Announcements and Welcome Farmer components show up", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <PlayPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Announcements/)).toBeInTheDocument();
        expect(await screen.findByTestId("CommonsPlay")).toBeInTheDocument();
    });

    test("Make sure div has correct attributes", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <PlayPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        var div = screen.getByTestId("playpage-div");
        expect(div).toHaveAttribute("style", expect.stringContaining("background-size: cover; background-image: url(PlayPageBackground.png);"));
    });

    test("Chat toggle button opens and closes the ChatPanel", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <PlayPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("playpage-chat-toggle")).toBeInTheDocument();
        });
    
        // Make sure the chat toggle button is visible
        const chatToggleButton = screen.getByTestId("playpage-chat-toggle");
        expect(chatToggleButton).toBeInTheDocument();
        
        // Make sure the ChatPanel is not visible initially
        expect(screen.queryByTestId("ChatPanel")).not.toBeInTheDocument();
    
        // Click the chat toggle button to open the ChatPanel
        fireEvent.click(chatToggleButton);
    
        // Wait for the ChatPanel to become visible
        await waitFor(() => {
            expect(screen.getByTestId("ChatPanel")).toBeInTheDocument();
        });
    
        // Click the chat toggle button again to close the ChatPanel
        fireEvent.click(chatToggleButton);
    
        // Wait for the ChatPanel to become hidden
        await waitFor(() => {
            expect(screen.queryByTestId("ChatPanel")).not.toBeInTheDocument();
        });
    });

    test("Chat button and container have correct styles", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <PlayPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("playpage-chat-toggle")).toBeInTheDocument();
        });

        const chatButton = screen.getByTestId("playpage-chat-toggle");
        const chatContainer = screen.getByTestId("playpage-chat-div");

        
        expect(chatButton).toHaveTextContent('💬');
        const messageIcon = screen.getByTestId("message-icon");
        expect(messageIcon).toHaveStyle('font-family: Arial, sans-serif;');
        expect(messageIcon).toHaveStyle('font-size: 30px;');
        // Click the chat toggle button to open the ChatPanel
        fireEvent.click(chatButton);

        await waitFor(() => {
            expect(chatButton).toHaveTextContent('❌');
        });
        const closeIcon = screen.getByTestId("close-icon");
        expect(closeIcon).toHaveStyle('font-family: Arial, sans-serif;');
        expect(closeIcon).toHaveStyle('font-size: 30px;');

        // Check styles for the chat button
        expect(chatButton).toHaveStyle(`
            width: 60px;
            height: 60px;
            border-radius: 25%;
            background-color: lightblue;
            color: black;
            position: fixed;
            bottom: 30px;
            right: 30px;
        `);

        // Check styles for the chat container
        expect(chatContainer).toHaveStyle(`
            width: 550px;
            position: fixed;
            bottom: 100px;
            right: 20px;
        `);
    });

    test("Buy and Sell Cows Modal is Closed by Default", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <PlayPage />
                </MemoryRouter>
            </QueryClientProvider>
        );


        expect(() => screen.getByTestId("buy-sell-cow-modal")).toThrow();
    });

    test("Doesn't show chat button for non-admins if showChat is false", async () => {
        const userCommons = {
            commonsId: 1,
            id: 1,
            totalWealth: 0,
            userId: 1,
        };
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
        axiosMock.onGet("/api/usercommons/forcurrentuser", { params: { commonsId: 1 } }).reply(200, userCommons);
        axiosMock.onGet("/api/commons", { params: { id: 1 } }).reply(200, {
            id: 1,
            name: "Sample Commons"
        });
        axiosMock.onGet("/api/commons/all").reply(200, [
            {
                id: 1,
                name: "Sample Commons"
            }
        ]);
        axiosMock.onGet("/api/commons/plus", { params: { id: 1 } }).reply(200, {
            commons: {
                id: 1,
                name: "Sample Commons",
                showChat: false,
            },
            totalPlayers: 5,
            totalCows: 5 
        });
        axiosMock.onGet("/api/profits/all/commonsid").reply(200, []);
        axiosMock.onPut("/api/usercommons/sell").reply(200, userCommons);
        axiosMock.onPut("/api/usercommons/buy").reply(200, userCommons);
        
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <PlayPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.queryByTestId("playpage-chat-toggle")).not.toBeInTheDocument();
        });
    })

    test("Shows chat button for admins if showChat is false", async () => {
        const userCommons = {
            commonsId: 1,
            id: 1,
            totalWealth: 0,
            userId: 1,
        };
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
        axiosMock.onGet("/api/usercommons/forcurrentuser", { params: { commonsId: 1 } }).reply(200, userCommons);
        axiosMock.onGet("/api/commons", { params: { id: 1 } }).reply(200, {
            id: 1,
            name: "Sample Commons"
        });
        axiosMock.onGet("/api/commons/all").reply(200, [
            {
                id: 1,
                name: "Sample Commons"
            }
        ]);
        axiosMock.onGet("/api/commons/plus", { params: { id: 1 } }).reply(200, {
            commons: {
                id: 1,
                name: "Sample Commons",
                showChat: false,
            },
            totalPlayers: 5,
            totalCows: 5 
        });
        axiosMock.onGet("/api/profits/all/commonsid").reply(200, []);
        axiosMock.onPut("/api/usercommons/sell").reply(200, userCommons);
        axiosMock.onPut("/api/usercommons/buy").reply(200, userCommons);
        
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <PlayPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("playpage-chat-toggle")).toBeInTheDocument();
        });
    })
});