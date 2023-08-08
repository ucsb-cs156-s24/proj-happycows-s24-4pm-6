import {  fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import AdminViewReportPage from "main/pages/AdminViewReportPage";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import reportFixtures from "fixtures/reportFixtures";
import reportLineFixtures from "fixtures/reportLineFixtures";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate,
    useParams: () => ({
        reportId: 17
    }),
}));

describe("AdminViewReportPage tests", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    test("renders correctly for admin user", async () => {
        // arrange
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/reports/byReportId").reply(200, reportFixtures.threeReports[0]);
        axiosMock.onGet("/api/reports/lines").reply(200, reportLineFixtures.twoReportLines);

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AdminViewReportPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert

        await waitFor( () => {
            expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(4);
        })

        expect(axiosMock.history.get[0].url).toBe("/api/currentUser");
        expect(axiosMock.history.get[1].url).toBe("/api/systemInfo");
        expect(axiosMock.history.get[2].url).toBe("/api/reports/byReportId");
        expect(axiosMock.history.get[3].url).toBe("/api/reports/lines");

        expect(screen.getByText("Instructor Report")).toBeInTheDocument();
        expect(screen.getByText("Back to Reports")).toBeInTheDocument();
       
        expect(screen.getByText("Cow Price")).toBeInTheDocument();
        expect(screen.getByText("Num Users")).toBeInTheDocument();

        expect(screen.getByTestId("ReportTable-cell-row-0-col-numUsers")).toBeInTheDocument();

    });

    test("back to reports button navigates correctly", async () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/reports/byReportId").reply(200, reportFixtures.threeReports[0]);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AdminViewReportPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(screen.getByText("Back to Reports")).toBeInTheDocument();
        const backButton = screen.getByText("Back to Reports");
        fireEvent.click(backButton);

        expect(screen.queryByText("View Report")).not.toBeInTheDocument();
        
        expect(mockedNavigate).toHaveBeenCalledTimes(1);
        expect(mockedNavigate).toHaveBeenCalledWith("/admin/reports");
    });

    test("CSV button has correct address", async () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/reports/byReportId").reply(200, reportFixtures.threeReports[0]);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AdminViewReportPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(screen.getByText("Download as CSV")).toBeInTheDocument();
        const csvButton = screen.getByText("Download as CSV");
        expect(csvButton).toHaveAttribute("href", "/api/reports/download?reportId=17");
    });

   
});
