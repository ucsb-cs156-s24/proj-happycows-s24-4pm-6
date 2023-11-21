import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import ReportLineTable from "main/components/Reports/ReportLineTable";
import reportLineFixtures from "fixtures/reportLineFixtures";

describe("ReportLineTable tests", () => {
  const queryClient = new QueryClient();

  test("Has the expected column headers and content", () => {

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ReportLineTable reportLines={reportLineFixtures.twoReportLines}  />
        </MemoryRouter>
      </QueryClientProvider>

    );

    const expectedFields = ['userId', 'username', 'totalWealth', 'numOfCows', 'avgCowHealth', 'cowsBought', 'cowsSold', 'cowDeaths', 'createDate']
    const expectedHeaders = ['userId', 'Username', 'Total Wealth', 'Num Cows', 'Avg Cow Health', 'Cows Bought', 'Cows Sold', 'Cow Deaths', 'Create Date']
      
    const testId = "ReportLineTable"

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });


    expect(screen.getByTestId(`${testId}-cell-row-0-col-userId`)).toHaveTextContent("1");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-username`)).toHaveTextContent("Phill Conrad");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-totalWealth`)).toHaveTextContent("$9,745.00");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-numOfCows`)).toHaveTextContent("3");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-avgCowHealth`)).toHaveTextContent("100");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-cowsBought`)).toHaveTextContent("3");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-cowsSold`)).toHaveTextContent("0");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-cowDeaths`)).toHaveTextContent("0");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-createDate`)).toHaveTextContent("2023-08-07T01:12:54.767+00:00");
  });

  test("Has numeric values right-justified", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ReportLineTable reportLines={reportLineFixtures.twoReportLines}  />
        </MemoryRouter>
      </QueryClientProvider>

    );

    expect(screen.getAllByText("$9,745.00")[0]).toHaveStyle("text-align: right;")
    expect(screen.getAllByText("3")[0]).toHaveStyle("text-align: right;");
    expect(screen.getAllByText("100")[0]).toHaveStyle("text-align: right;");
    expect(screen.getAllByText("3")[1]).toHaveStyle("text-align: right;");
    expect(screen.getAllByText("0")[0]).toHaveStyle("text-align: right;");
    expect(screen.getAllByText("0")[1]).toHaveStyle("text-align: right;");
    expect(screen.getAllByText("2023-08-07T01:12:54.767+00:00")[0]).toHaveStyle("text-align: right;");
  });
});

