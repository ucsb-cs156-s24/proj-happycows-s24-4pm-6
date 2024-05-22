import {  render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import AdminReportsPage from "main/pages/AdminReportsPage";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("AdminReportsPage tests", () => {
    const axiosMock = new AxiosMockAdapter(axios);
    
    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    test("renders correctly for admin user", async () => {
        setupAdminUser();
        const queryClient = new QueryClient();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AdminReportsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(screen.getByText("Instructor Reports")).toBeInTheDocument();
    });

   
});
