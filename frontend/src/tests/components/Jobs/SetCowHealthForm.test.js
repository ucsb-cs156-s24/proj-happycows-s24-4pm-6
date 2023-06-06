import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {BrowserRouter as Router} from "react-router-dom";
import jobsFixtures from "fixtures/jobsFixtures";
import SetCowHealthForm from "main/components/Jobs/SetCowHealthForm";
import {QueryClient, QueryClientProvider} from "react-query";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("SetCowHealthForm tests", () => {
  it("renders correctly with the right defaults", async () => {
    render(
        <QueryClientProvider client={new QueryClient()}>
          <Router>
            <SetCowHealthForm jobs={jobsFixtures.sixJobs}/>
          </Router>
        </QueryClientProvider>
    );

    //expect(await screen.findByTestId("TestJobForm-fail")).toBeInTheDocument();
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
            <SetCowHealthForm jobs={jobsFixtures.sixJobs}/>
          </Router>
        </QueryClientProvider>
    );

    //expect(await screen.findByTestId("TestJobForm-fail")).toBeInTheDocument();
    const submitButton = screen.getByTestId("SetCowHealthForm-Submit-Button");
    const healthInput = screen.getByTestId("SetCowHealthForm-healthValue");

    expect(submitButton).toBeInTheDocument();
    expect(healthInput).toHaveValue(100);

    fireEvent.change(healthInput, { target: { value: "-1" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Health must be/i)).toBeInTheDocument();
    })
    expect(submitAction).not.toBeCalled();
  });
});
