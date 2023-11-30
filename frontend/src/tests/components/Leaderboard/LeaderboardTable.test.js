import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import LeaderboardTable from "main/components/Leaderboard/LeaderboardTable";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import leaderboardFixtures from "fixtures/leaderboardFixtures";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockedNavigate,
}));

describe("LeaderboardTable tests", () => {
    const queryClient = new QueryClient();

    test("renders without crashing for empty table with user not logged in", () => {
        const currentUser = null;

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <LeaderboardTable
                        leaderboardUsers={[]}
                        currentUser={currentUser}
                    />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });
    test("renders without crashing for empty table for ordinary user", () => {
        const currentUser = currentUserFixtures.userOnly;

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <LeaderboardTable
                        leaderboardUsers={[]}
                        currentUser={currentUser}
                    />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("renders without crashing for empty table for admin", () => {
        const currentUser = currentUserFixtures.adminUser;

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <LeaderboardTable
                        leaderboardUsers={[]}
                        currentUser={currentUser}
                    />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("Has the expected column headers and content for adminUser", () => {
        const currentUser = currentUserFixtures.adminUser;

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <LeaderboardTable
                        leaderboardUsers={leaderboardFixtures.fiveUserCommonsLB}
                        currentUser={currentUser}
                    />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const expectedHeaders = [
            "Farmer",
            "Total Wealth",
            "Cows Owned",
            "Cow Health",
            "Cows Bought",
            "Cows Sold",
            "Cow Deaths",
        ];
        const expectedFields = [
            "Farmer",
            "totalWealth",
            "numOfCows",
            "cowHealth",
            "cowsBought",
            "cowsSold",
            "cowDeaths",
        ];
        const testId = "LeaderboardTable";

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expectedFields.forEach((field) => {
            const header = screen.getByTestId(
                `${testId}-cell-row-0-col-${field}`
            );
            expect(header).toBeInTheDocument();
        });

        expect(
            screen.getByTestId(`${testId}-cell-row-0-col-Farmer`)
        ).toHaveTextContent("one");
        expect(
            screen.getByTestId(`${testId}-cell-row-0-col-totalWealth`)
        ).toHaveTextContent("$1,000.00");
        expect(
            screen.getByTestId(`${testId}-cell-row-0-col-numOfCows`)
        ).toHaveTextContent("12");
        expect(
            screen.getByTestId(`${testId}-cell-row-0-col-cowHealth`)
        ).toHaveTextContent("93");
        expect(
            screen.getByTestId(`${testId}-cell-row-0-col-cowsBought`)
        ).toHaveTextContent("11");
        expect(
            screen.getByTestId(`${testId}-cell-row-0-col-cowsSold`)
        ).toHaveTextContent("10");
        expect(
            screen.getByTestId(`${testId}-cell-row-0-col-cowDeaths`)
        ).toHaveTextContent("9");
    });

    test("Total wealth is formatted correctly", () => {
        const currentUser = currentUserFixtures.adminUser;

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <LeaderboardTable
                        leaderboardUsers={leaderboardFixtures.fiveUserCommonsLB}
                        currentUser={currentUser}
                    />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(screen.getAllByText("$1,000.00")[0]).toHaveStyle(
            "text-align: right;"
        );
        expect(screen.getAllByText("12")[0]).toHaveStyle("text-align: right;");

        expect(screen.getAllByText("93")[0]).toHaveStyle("text-align: right;");

        expect(screen.getAllByText("11")[0]).toHaveStyle("text-align: right;");
        expect(screen.getAllByText("10")[0]).toHaveStyle("text-align: right;");
        expect(screen.getAllByText("9")[0]).toHaveStyle("text-align: right;");
    });
    test("Clicking on link navigates to the correct URL", () => {
        const currentUser = currentUserFixtures.adminUser;

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <LeaderboardTable
                        leaderboardUsers={leaderboardFixtures.fiveUserCommonsLB}
                        currentUser={currentUser}
                    />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const expectedHeaders = [
            "Farmer",
            "Total Wealth",
            "Cows Owned",
            "Cow Health",
            "Cows Bought",
            "Cows Sold",
            "Cow Deaths",
        ];
        const expectedFields = [
            "Farmer",
            "totalWealth",
            "numOfCows",
            "cowHealth",
            "cowsBought",
            "cowsSold",
            "cowDeaths",
        ];
        const testId = "LeaderboardTable";

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expectedFields.forEach((field) => {
            const header = screen.getByTestId(
                `${testId}-cell-row-0-col-${field}`
            );
            expect(header).toBeInTheDocument();
        });

        const link = screen.getByText("one"); // Update to match the text in your link
        expect(screen.getByText("one")).toHaveAttribute(
            "href",
            "/admin/play/1/user/1"
        );

        fireEvent.click(link);

        // Assert the expected URL based on your data
        expect(window.location.href).toBe("http://localhost/");
    });
});
