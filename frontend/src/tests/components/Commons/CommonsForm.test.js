import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import CommonsForm from "main/components/Commons/CommonsForm";
import { QueryClient, QueryClientProvider } from "react-query";
import commonsFixtures from "fixtures/commonsFixtures"
import AxiosMockAdapter from "axios-mock-adapter";
import axios from "axios";
import healthUpdateStrategyListFixtures from "fixtures/healthUpdateStrategyListFixtures";

// Next line uses technique from https://www.chakshunyu.com/blog/how-to-spy-on-a-named-import-in-jest/
import * as useBackendModule from "main/utils/useBackend";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate
}));

describe("CommonsForm tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", async () => {

    axiosMock
      .onGet("/api/commons/all-health-update-strategies")
      .reply(200, healthUpdateStrategyListFixtures.simple);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <Router>
          <CommonsForm />
        </Router>
      </QueryClientProvider>
    );

    expect(await screen.findByText(/Commons Name/)).toBeInTheDocument();

    [
      /Starting Balance/,
      /Cow Price/,
      /Milk Price/,
      /Starting Date/,
      /Degradation Rate/,
      /Carrying Capacity/,
      /Show Leaderboard\?/,
      /When below capacity/,
      /When above capacity/,

    ].forEach(
      (pattern) => {
        expect(screen.getByText(pattern)).toBeInTheDocument();
      }
    );
    expect(screen.getByText(/Create/)).toBeInTheDocument();
  });


  it("has validation errors for required fields", async () => {
    const submitAction = jest.fn();

    axiosMock
      .onGet("/api/commons/all-health-update-strategies")
      .reply(200, healthUpdateStrategyListFixtures.simple);


    render(
      <QueryClientProvider client={new QueryClient()}>
        <Router>
          <CommonsForm submitAction={submitAction} buttonLabel="Create" />
        </Router>
      </QueryClientProvider>
    );

    expect(await screen.findByTestId("CommonsForm-name")).toBeInTheDocument();
    const submitButton = screen.getByTestId("CommonsForm-Submit-Button");
    expect(submitButton).toBeInTheDocument();

    fireEvent.click(submitButton);
    expect(await screen.findByText(/commons name is required/i)).toBeInTheDocument();

    expect(screen.getByText(/starting balance is required/i)).toBeInTheDocument();
    expect(screen.getByText(/cow price is required/i)).toBeInTheDocument();
    expect(screen.getByText(/milk price is required/i)).toBeInTheDocument();
    expect(screen.getByText(/starting date is required/i)).toBeInTheDocument();
    expect(screen.getByText(/degradation rate is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Carrying capacity is required/i)).toBeInTheDocument();

    expect(submitAction).not.toBeCalled();
  });



  it("renders correctly when an initialCommons is passed in", async () => {

    axiosMock
      .onGet("/api/commons/all-health-update-strategies")
      .reply(200, healthUpdateStrategyListFixtures.simple);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <Router>
          <CommonsForm initialCommons={commonsFixtures.threeCommons[0]}/>
        </Router>
      </QueryClientProvider>
    );

    expect(await screen.findByText(/Id/)).toBeInTheDocument();

    expect(screen.getByTestId("CommonsForm-id")).toHaveValue(`${commonsFixtures.threeCommons[0].id}`);
    expect(screen.getByTestId("CommonsForm-name")).toHaveValue(commonsFixtures.threeCommons[0].name);
    expect(screen.getByTestId("CommonsForm-startingBalance")).toHaveValue(commonsFixtures.threeCommons[0].startingBalance);

  });


  test("the correct parameters are passed to useBackend", async () => {

    axiosMock
      .onGet("/api/commons/all-health-update-strategies")
      .reply(200, healthUpdateStrategyListFixtures.simple);

    // https://www.chakshunyu.com/blog/how-to-spy-on-a-named-import-in-jest/
    const useBackendSpy = jest.spyOn(useBackendModule, 'useBackend');

    render(
      <QueryClientProvider client={new QueryClient()}>
        <Router>
          <CommonsForm />
        </Router>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(useBackendSpy).toHaveBeenCalledWith(
        "/api/commons/all-health-update-strategies", {
        method: "GET",
        url: "/api/commons/all-health-update-strategies",
      },
      );
    });
  });

});
