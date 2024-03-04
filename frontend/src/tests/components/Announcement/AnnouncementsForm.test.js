import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import AnnouncementForm from "main/components/Announcement/AnnouncementForm";
import { announcementFixtures } from "fixtures/announcementFixtures"

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("AnnouncementForm tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["Start", "End", "Announcement"];
    const testId = "AnnouncementForm";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <AnnouncementForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

    });

    test("renders correctly when passing in initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <AnnouncementForm initialContents={announcementFixtures.oneAnnouncement} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
        expect(screen.getByText(`Id`)).toBeInTheDocument();
    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <AnnouncementForm />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
        const cancelButton = screen.getByTestId(`${testId}-cancel`);

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });

    test("that the correct validations are performed", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <AnnouncementForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        const submitButton = screen.getByText(/Create/);
        fireEvent.click(submitButton);

        await screen.findByText(/Start is required and must be provided in ISO format./);
        expect(screen.getByText(/Announcement is required./)).toBeInTheDocument();

        // const endInput = screen.getByTestId(`${testId}-end`);
        // fireEvent.change(endInput, { target: { value: "a" } });
        // fireEvent.click(submitButton);

        // await waitFor(() => {
        //     expect(screen.getByText(/End must be provided in ISO format./)).toBeInTheDocument();
        // });
    });

});