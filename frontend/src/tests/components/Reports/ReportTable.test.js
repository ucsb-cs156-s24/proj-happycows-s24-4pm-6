import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import ReportTable from "main/components/Reports/ReportTable";
import reportFixtures from "fixtures/reportFixtures";


describe("ReportTable tests", () => {
  const queryClient = new QueryClient();

  test("Has the expected column headers and content", () => {

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ReportTable reports={reportFixtures.threeReports}  />
        </MemoryRouter>
      </QueryClientProvider>

    );

    const expectedFields = ['id', 'commonsId', 'name',   'numUsers', 'numCows', 'createDate']
    const expectedHeaders = ['id', 'commonsId', 'Name',  'Num Users', 'Num Cows', 'Create Date']

    const testId = "ReportTable"

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-commonsId`)).toHaveTextContent("1");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-name`)).toHaveTextContent("Blue");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-numUsers`)).toHaveTextContent("1");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-numCows`)).toHaveTextContent("3");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-createDate`)).toHaveTextContent("2023-08-07T01:12:09.088+00:00");

  });

});

