import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter as Router } from "react-router-dom";
import InstructorReportSpecificCommonsForm from "main/components/Jobs/InstructorReportSpecificCommonsForm";
import { QueryClient, QueryClientProvider } from "react-query";
import AxiosMockAdapter from "axios-mock-adapter";
import axios from "axios";
import commonsFixtures from "fixtures/commonsFixtures";

// Next line uses technique from https://www.chakshunyu.com/blog/how-to-spy-on-a-named-import-in-jest/
import * as useBackendModule from "main/utils/useBackend";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("InstructorReportSpecificCommonsForm tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  it("renders the fallback text correctlyl", async () => {

    axiosMock
      .onGet("/api/commons/all")
      .reply(200, []);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <Router>
          <InstructorReportSpecificCommonsForm  />
        </Router>
      </QueryClientProvider>
    );

    expect(
      await screen.findByText("There are no commons on which to run this job.")
    ).toBeInTheDocument();
  });

  test("user can sucessfully submit the job", async () => {

    const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
    getItemSpy.mockImplementation(() => null);

    const submitAction = jest.fn();
    axiosMock
      .onGet("/api/commons/all")
      .reply(200, commonsFixtures.threeCommons);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <Router>
          <InstructorReportSpecificCommonsForm
            submitAction={submitAction}
          />
        </Router>
      </QueryClientProvider>
    );

    const commonsRadio = await screen.findByTestId(
      "InstructorReportSpecificCommonsForm-commons-1"
    );
    expect(commonsRadio).toBeInTheDocument();
    fireEvent.click(commonsRadio);

    expect(screen.queryByText("There are no commons on which to run this job.")).not.toBeInTheDocument();

    const submitButton = screen.getByTestId("InstructorReportSpecificCommonsForm-Submit-Button");

    expect(submitButton).toBeInTheDocument();

    fireEvent.click(submitButton);

    // assert - check that the console.log was called with the expected message
    await waitFor(() => {
      expect(submitAction).toHaveBeenCalled();
    });

    expect(submitAction).toHaveBeenCalledWith(
      {
        "selectedCommons": 1,
        "selectedCommonsName": "Anika's Commons"
      }
    );
  });


  test("the first item in commons array is selected by default", async () => {
    const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
    getItemSpy.mockImplementation((key) => (key === "InstructorReportSpecificCommonsForm-health" ? 42 : null));

    axiosMock
      .onGet("/api/commons/all")
      .reply(200, commonsFixtures.threeCommons);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <Router>
          <InstructorReportSpecificCommonsForm  />
        </Router>
      </QueryClientProvider>
    );

    const defaultId = commonsFixtures.threeCommons[0].id;
    const testIdForFirstItem = `InstructorReportSpecificCommonsForm-commons-${defaultId}`;
    await waitFor(() => {
      expect(screen.getByTestId(testIdForFirstItem)).toBeInTheDocument();
    });

    const commons = screen.getByTestId(testIdForFirstItem);
    expect(commons).toHaveAttribute("checked", "");

  });

  test("the correct parameters are passed to useBackend", async () => {
    // https://www.chakshunyu.com/blog/how-to-spy-on-a-named-import-in-jest/
    const useBackendSpy = jest.spyOn(useBackendModule, 'useBackend');

    render(
      <QueryClientProvider client={new QueryClient()}>
        <Router>
          <InstructorReportSpecificCommonsForm  />
        </Router>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(useBackendSpy).toHaveBeenCalledWith(
        ["/api/commons/all"],
        { url: "/api/commons/all" },
        []
      );
    });
  });

});
