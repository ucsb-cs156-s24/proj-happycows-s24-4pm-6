import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import LeaderboardTable from "main/components/Leaderboard/LeaderboardTable";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import leaderboardFixtures from "fixtures/leaderboardFixtures";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("LeaderboardTable tests", () => {
  const queryClient = new QueryClient();

  test("renders without crashing for empty table with user not logged in", () => {
    const currentUser = null;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <LeaderboardTable leaderboardUsers={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });
  test("renders without crashing for empty table for ordinary user", () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <LeaderboardTable leaderboardUsers={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });

  test("renders without crashing for empty table for admin", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <LeaderboardTable leaderboardUsers={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });

  test("Has the expected column headers and content for adminUser", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <LeaderboardTable leaderboardUsers={leaderboardFixtures.threeUserCommonsLB} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    const expectedHeaders = ['(Admin) userCommons Id', 'Username', 'User Id', 'Total Wealth', 'Cows Owned', 'Cow Health', 'Cows Bought', 'Cows Sold', 'Cow Deaths'];
    const expectedFields = ['id', 'userId', 'username', 'totalWealth','numOfCows', 'cowHealth', 'cowsBought', 'cowsSold', 'cowDeaths'];
    const testId = "LeaderboardTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-userId`)).toHaveTextContent("1");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-username`)).toHaveTextContent("one");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-totalWealth`)).toHaveTextContent("$1,000.00");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-cowsBought`)).toHaveTextContent("8");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-cowsSold`)).toHaveTextContent("8");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-cowDeaths`)).toHaveTextContent("8");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-userId`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-username`)).toHaveTextContent("two");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-totalWealth`)).toHaveTextContent("$1,000.00");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-cowsBought`)).toHaveTextContent("5");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-cowsSold`)).toHaveTextContent("5");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-cowDeaths`)).toHaveTextContent("5");

  });

  test("Total wealth is formatted correctly", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <LeaderboardTable leaderboardUsers={leaderboardFixtures.threeUserCommonsLB} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    expect(screen.getAllByText("$1,000.00")[0]).toHaveStyle("text-align: right;");

  });
    

});

