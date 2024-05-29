import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {QueryClient, QueryClientProvider} from "react-query";
import {MemoryRouter} from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import AdminEditAnnouncementPage from "main/pages/AdminEditAnnouncementPage";
import {apiCurrentUserFixtures} from "fixtures/currentUserFixtures";
import {systemInfoFixtures} from "fixtures/systemInfoFixtures";
import healthUpdateStrategyListFixtures from "../../fixtures/healthUpdateStrategyListFixtures";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 5
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("AdminEditAnnouncementPage tests", () => {
    describe("tests where backend is working normally", () => {
        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/commons/all-health-update-strategies").reply(200, healthUpdateStrategyListFixtures.simple);
            axiosMock.onGet("/api/announcements/getbyid", { params: { id: 5 } }).reply(200, {
                "id": 5,
                "commonsId": 1,
                "startDate": "2022-03-05",
                "endDate": "2023-03-05",
                "announcementText": "test original",
            });
            axiosMock.onPut('/api/announcements/put', { params: { id: 5 } }).reply(200, {
                "id": 5,
                "commonsId": 1,
                "startDate": "2022-03-07",
                "endDate": "2023-03-07",
                "announcementText": "test updated",
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <AdminEditAnnouncementPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <AdminEditAnnouncementPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            expect(await screen.findByLabelText(/Announcement/)).toBeInTheDocument();

            const announcementTextField = screen.getByLabelText(/Announcement/);
            

            
            expect(announcementTextField).toHaveValue("test original");
            
        });

        test("Changes when you click Update", async () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <AdminEditAnnouncementPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            expect(await screen.findByLabelText(/Start Date/)).toBeInTheDocument();

            const startDateField = screen.getByLabelText(/Start Date/);
            const endDateField = screen.getByLabelText(/End Date/);
            const announcementTextField = screen.getByLabelText(/Announcement/);


            
            expect(announcementTextField).toHaveValue("test original");

            const submitButton = screen.getByText("Update");

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(startDateField, { target: { value: "2022-03-07" } })
            fireEvent.change(endDateField, { target: { value: "2023-03-07" } })
            fireEvent.change(announcementTextField, { target: { value: "test updated" } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toHaveBeenCalled());
            expect(mockToast).toBeCalledWith("Announcement Updated - id: 5");
            expect(mockNavigate).toBeCalledWith({ "to": "/admin/announcements" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 5 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                "startDate": "2022-03-07T00:00:00.000Z",
                "endDate": "2023-03-07T00:00:00.000Z",
                "announcementText": "test updated",
            })); // posted object
        });
    });
});
