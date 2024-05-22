import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import ReportTable from "main/components/Reports/ReportTable";
import reportFixtures from "fixtures/reportFixtures";


const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({
    commonsId: 1
  }),
  useNavigate: () => mockNavigate
}));

describe("ReportTable tests", () => {

  const testId = "ReportTable"

  const queryClient = new QueryClient();

  test("Has the expected column headers and content", () => {

    // act

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ReportTable reports={reportFixtures.threeReports} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    // assert 

    const expectedFields = ['id', 'commonsId', 'name', 'numUsers', 'numCows', 'createDate']
    const expectedHeaders = ['id', 'commonsId', 'Name', 'Num Users', 'Num Cows', 'Create Date']


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

  test("When not on storybook, navigates to view page", () => {

    // act 
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ReportTable reports={reportFixtures.threeReports} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    // assert 

    expect(screen.getByTestId(`${testId}-cell-row-0-col-View Report-button`)).toBeInTheDocument();
    const viewButton = screen.getByTestId(`${testId}-cell-row-0-col-View Report-button`);
    expect(viewButton).toHaveClass("btn-secondary");
    viewButton.click();
    expect(mockNavigate).toHaveBeenCalledWith("/admin/report/1");

  });

  test("When on storybook, calls window.alert", async () => {

    // arrange

    const mockAlert = jest.spyOn(window, "alert").mockImplementation(() => { });

    // act 
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ReportTable reports={reportFixtures.threeReports} storybook={true} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    // assert 

    expect(screen.getByTestId(`${testId}-cell-row-0-col-View Report-button`)).toBeInTheDocument();
    const viewButton = screen.getByTestId(`${testId}-cell-row-0-col-View Report-button`);
    viewButton.click();
    await waitFor(()=>{
      expect(mockAlert).toHaveBeenCalledWith(`would navigate to /admin/report/1`);
    });
    mockAlert.mockRestore();

  });

  test("Has all numeric values right-justified", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ReportTable reports={reportFixtures.threeReports} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    expect(screen.getAllByText("1")[2]).toHaveStyle("text-align: right;")
    expect(screen.getAllByText("1")[3]).toHaveStyle("text-align: right;");
    expect(screen.getAllByText("3")[0]).toHaveStyle("text-align: right;");  
  });

});

