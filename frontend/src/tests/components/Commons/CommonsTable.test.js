import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import CommonsTable from "main/components/Commons/CommonsTable"
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import commonsPlusFixtures from "fixtures/commonsPlusFixtures";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("UserTable tests", () => {
  const queryClient = new QueryClient();

  test("renders without crashing for empty table with user not logged in", () => {
    const currentUser = null;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CommonsTable commons={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });
  test("renders without crashing for empty table for ordinary user", () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CommonsTable commons={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });

  test("renders without crashing for empty table for admin", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CommonsTable commons={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });

  test("Has the expected column headers and content for adminUser", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CommonsTable commons={commonsPlusFixtures.threeCommonsPlus} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    const expectedHeaders = ["id", "Name", "Cow Price", 'Milk Price', 'Starting Balance', 'Starting Date', 'Degradation Rate', 'Carrying Capacity'];
    const expectedFields = ["id", "name", "cowPrice", "milkPrice", "startingBalance", "startingDate", "degradationRate", "carryingCapacity"];
    const testId = "CommonsTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-commons.${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-commons.id`)).toHaveTextContent("1");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-commons.id`)).toHaveTextContent("2");
  });
});
