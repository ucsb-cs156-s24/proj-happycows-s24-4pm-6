import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import HomePage from "main/pages/HomePage";
import commonsFixtures from "fixtures/commonsFixtures";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: () => ({
        commonsId: 1
    }),
    useNavigate: () => mockNavigate
}));

describe("HomePage tests", () => {
    const queryClient = new QueryClient();
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        jest.clearAllMocks();
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    test("renders without crashing when lists return empty list", () => {
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/commons/all").reply(200, []);
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HomePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const mainDiv = screen.getByTestId("HomePage-main-div");
        expect(mainDiv).toBeInTheDocument();

        const title = screen.getByTestId("homePage-title");
        expect(title).toBeInTheDocument();
        expect(typeof (title.textContent)).toBe('string');
        expect(title.textContent).toEqual('Howdy Farmer');
    });

    test("renders with default for commons when api times out", () => {
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/commons/all").timeout();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HomePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const mainDiv = screen.getByTestId("HomePage-main-div");
        expect(mainDiv).toBeInTheDocument();

        const title = screen.getByTestId("homePage-title");
        expect(title).toBeInTheDocument();
        expect(typeof (title.textContent)).toBe('string');
        expect(title.textContent).toEqual('Howdy Farmer');

        expect(() => screen.getAllByTestId(/commonsCard-button/)).toThrow('Unable to find an element');
    });

    test("expected CSS properties", () => {
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/commons/all").reply(200, []);
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HomePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const title = screen.getByTestId("homePage-title");
        expect(title).toHaveAttribute("style", "font-size: 75px; border-radius: 7px; background-color: white; opacity: 0.9;");
    });

    test("renders without crashing when lists are full", () => {
        apiCurrentUserFixtures.userOnly.user.commons = commonsFixtures.oneCommons;
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/commons/all").reply(200, commonsFixtures.threeCommons);
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HomePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const title = screen.getByTestId("homePage-title");
        expect(title).toBeInTheDocument();
        expect(typeof (title.textContent)).toBe('string');
        expect(title.textContent).toEqual('Howdy Farmer');
    });

    test("Redirects to the PlayPage when you click visit", async () => {
        apiCurrentUserFixtures.userOnly.user.commons = commonsFixtures.oneCommons;
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/commons/all").reply(200, commonsFixtures.threeCommons);
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HomePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(await screen.findByTestId("commonsCard-button-Visit-1")).toBeInTheDocument();
        const visitButton = screen.getByTestId("commonsCard-button-Visit-1");
        fireEvent.click(visitButton);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/play/1");
        });
    });

    test("Calls the callback when you click join", async () => {
        apiCurrentUserFixtures.userOnly.user.commons = commonsFixtures.oneCommons;
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/commons/all").reply(200, commonsFixtures.threeCommons);
        axiosMock.onPost("/api/commons/join").reply(200, commonsFixtures.threeCommons[0]);

        
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HomePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(await screen.findByTestId("commonsCard-button-Join-4")).toBeInTheDocument();
        const joinButton = screen.getByTestId("commonsCard-button-Join-4");
        fireEvent.click(joinButton);

        await waitFor(() => {
            expect(axiosMock.history.post.length).toBe(1);
        });
        expect(axiosMock.history.post[0].url).toBe("/api/commons/join");
        expect(axiosMock.history.post[0].params).toEqual({ "commonsId": 4 });
    
    });



});