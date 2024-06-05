import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {QueryClient, QueryClientProvider} from "react-query";
import {MemoryRouter} from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import {apiCurrentUserFixtures} from "fixtures/currentUserFixtures";
import {systemInfoFixtures} from "fixtures/systemInfoFixtures";
import healthUpdateStrategyListFixtures from "../../fixtures/healthUpdateStrategyListFixtures";
import AdminCreateAnnouncementsPage from "main/pages/AdminCreateAnnouncementsPage";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        Navigate: (x) => { mockNavigate(x); return null; },
        useParams: () => ({ commonsId: '1' })
    };
});

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

describe("AdminCreateAnnouncementsPage tests", () => {
    const axiosMock = new AxiosMockAdapter(axios);
    const queryClient = new QueryClient();

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);

        axiosMock.onGet("/api/commons/all-health-update-strategies")
            .reply(200, healthUpdateStrategyListFixtures.simple);
    });

    test("renders without crashing", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AdminCreateAnnouncementsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(await screen.findByText("Create Announcement")).toBeInTheDocument();
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const announcement = {
            id: 17,
            commonsId: 1,
            startDate: "2022-02-02T00:00",
            endDate: "2022-03-02T00:00",
            announcementText: "Great"
        };

        axiosMock.onPost("/api/announcements/post").reply(200, announcement);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AdminCreateAnnouncementsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("AnnouncementForm-startDate")).toBeInTheDocument();
        });

        const startDateField = screen.getByTestId("AnnouncementForm-startDate");
        const endDateField = screen.getByTestId("AnnouncementForm-endDate");
        const announcementTextField = screen.getByTestId("AnnouncementForm-announcementText");
        const submitButton = screen.getByTestId("AnnouncementForm-submit");

        fireEvent.change(startDateField, { target: { value: '2022-02-02T00:00' } });
        fireEvent.change(endDateField, { target: { value: '2022-03-02T00:00' } });
        fireEvent.change(announcementTextField, { target: { value: 'Great' } });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
                "commonsId": "1",
                "startDate": "2022-02-02T00:00",
                "endDate": "2022-03-02T00:00",
                "announcementText": "Great"
        });

        expect(mockToast).toBeCalledWith("Announcement successfully created - id: 17");
        expect(mockNavigate).toBeCalledWith({ "to": "/admin/announcements/1" });
    });

});
