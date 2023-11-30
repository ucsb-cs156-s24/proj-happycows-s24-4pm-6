import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import LeaderboardPage from "main/pages/LeaderboardPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
    const originalModule = jest.requireActual("react-toastify");
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x),
    };
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
    const originalModule = jest.requireActual("react-router-dom");
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            commonsId: 1,
        }),
        useNavigate: () => mockNavigate,
    };
});

describe("LeaderboardPage tests", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    const setupUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock
            .onGet("/api/currentUser")
            .reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock
            .onGet("/api/systemInfo")
            .reply(200, systemInfoFixtures.showingNeither);
    };

    const setupAdmin = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock
            .onGet("/api/currentUser")
            .reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock
            .onGet("/api/systemInfo")
            .reply(200, systemInfoFixtures.showingNeither);
    };

    test("renders without crashing for users", async () => {
        setupUser();
        axiosMock.onGet("/api/commons", { params: { id: 1 } }).reply(200, {
            username: "Anika",
            totalWealth: 100.0,
            numOfCows: 5,
            cowHealth: 100,
            cowsBought: 10,
            cowsSold: 3,
            cowDeaths: 0,
            showLeaderboard: true,
        });
        axiosMock
            .onGet("/api/usercommons/commons/all", { params: { commonsId: 1 } })
            .reply(200, []);
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <LeaderboardPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        await waitFor(() => {
            expect(
                screen.getByTestId("LeaderboardPage-main-div")
            ).toBeInTheDocument();
        });

        const leaderboard_main_div = screen.getByTestId(
            "LeaderboardPage-main-div"
        );
        const leaderboard_back_button = screen.getByTestId(
            "LeaderboardPage-back-button"
        );
        expect(leaderboard_main_div).toHaveAttribute(
            "style",
            "background-size: cover; background-image: url(PlayPageBackground.png);"
        );

        expect(leaderboard_back_button).toBeInTheDocument();
    });

    test("that navigate(-1) is called when Back is clicked", async () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <LeaderboardPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        await screen.findByTestId("LeaderboardPage-back-button");
        const cancelButton = screen.getByTestId("LeaderboardPage-back-button");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith(-1));
    });

    test("renders leaderboard for users when showLeaderboard = true", async () => {
        setupUser();
        axiosMock.onGet("/api/commons", { params: { id: 1 } }).reply(200, {
            username: "Anika",
            totalWealth: 100.0,
            numOfCows: 5,
            cowHealth: 100,
            cowsBought: 10,
            cowsSold: 3,
            cowDeaths: 0,
            showLeaderboard: true,
        });
        axiosMock
            .onGet("/api/usercommons/commons/all", { params: { commonsId: 1 } })
            .reply(200, []);
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <LeaderboardPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        await waitFor(() => {
            expect(axiosMock.history.get.length).toEqual(4);
        });
        expect(await screen.findByText("Total Wealth")).toBeInTheDocument();
    });

    test("renders leaderboard error message for users when showLeaderboard = false", async () => {
        setupUser();
        axiosMock.onGet("/api/commons", { params: { id: 1 } }).reply(200, {
            username: "Anika",
            totalWealth: 100.0,
            numOfCows: 5,
            cowHealth: 100,
            cowsBought: 10,
            cowsSold: 3,
            cowDeaths: 0,
            showLeaderboard: false,
        });
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <LeaderboardPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        expect(
            await screen.findByText(
                "You're not authorized to see the leaderboard."
            )
        ).toBeInTheDocument();
    });

    test("renders leaderboard for Admin users when showLeaderboard = false", async () => {
        setupAdmin();
        axiosMock.onGet("/api/commons", { params: { id: 1 } }).reply(200, {
            username: "Anika",
            totalWealth: 100.0,
            numOfCows: 5,
            cowHealth: 100,
            cowsBought: 10,
            cowsSold: 3,
            cowDeaths: 0,
            showLeaderboard: false,
        });
        axiosMock
            .onGet("/api/usercommons/commons/all", { params: { commonsId: 1 } })
            .reply(200, []);
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <LeaderboardPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        await waitFor(() => {
            expect(axiosMock.history.get.length).toEqual(4);
        });
        expect(await screen.findByText("Total Wealth")).toBeInTheDocument();
    });
});
