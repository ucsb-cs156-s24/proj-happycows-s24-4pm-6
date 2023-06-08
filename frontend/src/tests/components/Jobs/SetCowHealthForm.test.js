import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import jobsFixtures from "fixtures/jobsFixtures";
import SetCowHealthForm from "main/components/Jobs/SetCowHealthForm";
import { QueryClient, QueryClientProvider } from "react-query";
import AxiosMockAdapter from "axios-mock-adapter";
import axios from "axios";
import commonsFixtures from "fixtures/commonsFixtures";
import mockConsole from "jest-mock-console";
const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("SetCowHealthForm tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  it("renders correctly with the right defaults", async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <Router>
          <SetCowHealthForm jobs={jobsFixtures.sixJobs} />
        </Router>
      </QueryClientProvider>
    );

    expect(
      await screen.findByTestId("SetCowHealthForm-healthValue")
    ).toBeInTheDocument();
    expect(screen.getByText(/Set Cow Health/)).toBeInTheDocument();
  });

  it("has validation errors for required fields", async () => {
    const submitAction = jest.fn();

    render(
      <QueryClientProvider client={new QueryClient()}>
        <Router>
          <SetCowHealthForm jobs={jobsFixtures.sixJobs} />
        </Router>
      </QueryClientProvider>
    );

    const submitButton = screen.getByTestId("SetCowHealthForm-Submit-Button");
    const healthInput = screen.getByTestId("SetCowHealthForm-healthValue");

    expect(submitButton).toBeInTheDocument();
    expect(healthInput).toHaveValue(100);

    fireEvent.change(healthInput, { target: { value: "-1" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Health must be/i)).toBeInTheDocument();
    });
    expect(submitAction).not.toBeCalled();
  });

  it("user can successfully submit the job", async () => {
    const submitAction = jest.fn();
    const restoreConsole = mockConsole();
    axiosMock
      .onGet("/api/commons/all")
      .reply(200, commonsFixtures.threeCommons);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <Router>
          <SetCowHealthForm
            submitAction={submitAction}
            jobs={jobsFixtures.sixJobs}
          />
        </Router>
      </QueryClientProvider>
    );

    const commonsRadio = await screen.findByTestId(
      "SetCowHealthForm-commons-1"
    );
    expect(commonsRadio).toBeInTheDocument();
    fireEvent.click(commonsRadio);

    const healthInput = screen.getByTestId("SetCowHealthForm-healthValue");
    const submitButton = screen.getByTestId("SetCowHealthForm-Submit-Button");

    expect(healthInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();

    fireEvent.change(healthInput, { target: { value: "10" } });
    submitButton.click();

    // assert - check that the console.log was called with the expected message
    await waitFor(() => {
      expect(console.log).toHaveBeenCalled();
    });
    expect(console.log).toHaveBeenNthCalledWith(1, "submitSetCowHealthJob", {
      healthValue: "10",
      selectedCommons: 1,
    });
    restoreConsole();

    expect(axiosMock.history.post[0].url).toBe(
      `/api/jobs/launch/setcowhealth?commonsID=1&health=10`
    );

    expect(submitAction).toHaveBeenCalled();
  });
});
