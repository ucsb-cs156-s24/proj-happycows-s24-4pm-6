
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import UpdateCowHealthForm from "main/components/Jobs/UpdateCowHealthForm";
import { QueryClient, QueryClientProvider } from "react-query";
import AxiosMockAdapter from "axios-mock-adapter";
import axios from "axios";
import commonsFixtures from "fixtures/commonsFixtures";


import * as useBackendModule from "main/utils/useBackend";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("UpdateCowHealthForm tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  it("user can sucessfully submit the job", async () => {

    const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
    getItemSpy.mockImplementation(() => null);

    const submitAction = jest.fn();
    axiosMock
      .onGet("/api/commons/all")
      .reply(200, commonsFixtures.threeCommons);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <Router>
          <UpdateCowHealthForm
            submitAction={submitAction}
          />
        </Router>
      </QueryClientProvider>
    );

    const commonsRadio = await screen.findByTestId(
      "UpdateCowHealthForm-commons-1"
    );
    expect(commonsRadio).toBeInTheDocument();
    fireEvent.click(commonsRadio);

    const submitButton = screen.getByTestId("UpdateCowHealthForm-Submit-Button");

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

    axiosMock
      .onGet("/api/commons/all")
      .reply(200, commonsFixtures.threeCommons);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <Router>
          <UpdateCowHealthForm  />
        </Router>
      </QueryClientProvider>
    );

    const defaultId = 0;
    const testIdForFirstItem = `UpdateCowHealthForm-commons-${defaultId}`;
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
          <UpdateCowHealthForm />
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
