import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import ReportHeaderTable from "main/components/Reports/ReportHeaderTable";
import reportFixtures from "fixtures/reportFixtures";


describe("ReportHeaderTable tests", () => {
  const queryClient = new QueryClient();

  test("Has the expected column headers and content", () => {

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ReportHeaderTable report={reportFixtures.threeReports[1]}  />
        </MemoryRouter>
      </QueryClientProvider>

    );

    const expectedFields = ['id', 'commonsId', 'name', 'cowPrice', 'milkPrice', 'startingBalance', 'startingDate', 'showLeaderboard', 'carryingCapacity', 'degradationRate', 'belowCapacityHealthUpdateStrategy', 'aboveCapacityHealthUpdateStrategy', 'numUsers', 'numCows', 'createDate']
    const expectedHeaders = ['id', 'commonsId', 'Name', 'Cow Price', 'Milk Price', 'Starting Balance', 'Starting Date', 'Show Leaderboard', 'Carrying Capacity', 'Degradation Rate', 'BelowCap Strategy', 'AboveCap Strategy', 'Num Users', 'Num Cows', 'Create Date']

    const testId = "ReportHeaderTable"

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("3");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-commonsId`)).toHaveTextContent("1");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("Blue");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-cowPrice`)).toHaveTextContent("100");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-milkPrice`)).toHaveTextContent("5");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-startingBalance`)).toHaveTextContent("10000");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-startingDate`)).toHaveTextContent("2023-08-06T00:00:00");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-showLeaderboard`)).toHaveTextContent("true");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-carryingCapacity`)).toHaveTextContent("10");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-degradationRate`)).toHaveTextContent("0.1");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-belowCapacityHealthUpdateStrategy`)).toHaveTextContent("Constant");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-aboveCapacityHealthUpdateStrategy`)).toHaveTextContent("Linear");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-numUsers`)).toHaveTextContent("1");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-numCows`)).toHaveTextContent("3");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-createDate`)).toHaveTextContent("2023-08-07T01:12:09.088+00:00");

  });

});

