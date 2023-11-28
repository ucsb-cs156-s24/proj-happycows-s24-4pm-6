import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter as Router } from "react-router-dom";
import TestJobsForm from "main/components/Jobs/TestJobForm";
import jobsFixtures from "fixtures/jobsFixtures";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate
}));

describe("TestJobsForm tests", () => {
  it("renders correctly with the right defaults", async () => {
    render(
      <Router >
        <TestJobsForm jobs={jobsFixtures.sixJobs}/>
      </Router>
    );

    expect(await screen.findByTestId("TestJobForm-fail")).toBeInTheDocument();
    expect(await screen.findByTestId("TestJobForm-sleepMs")).toBeInTheDocument();
    expect(screen.getByText(/Submit/)).toBeInTheDocument();
  });


  it("validates that sleepMs is present", async () => {
    const submitAction = jest.fn();

    render(
      <Router  >
        <TestJobsForm jobs={jobsFixtures.sixJobs}/>
      </Router  >
    );

    expect(await screen.findByTestId("TestJobForm-fail")).toBeInTheDocument();
    const submitButton = screen.getByTestId("TestJobForm-Submit-Button");
    const sleepMs = screen.getByTestId("TestJobForm-sleepMs");

    expect(submitButton).toBeInTheDocument();
    expect(sleepMs).toHaveValue(1000);


    fireEvent.change(sleepMs, { target: { value: '' } })
    fireEvent.click(submitButton);
    expect(await screen.findByText("sleepMs is required (0 is ok)")).toBeInTheDocument();
    expect(submitAction).not.toBeCalled();
    expect(screen.getByTestId("TestJobForm-sleepMs")).toHaveClass("is-invalid"); // tests for mutation to isInvalid={!!errors.sleepMs} idiom

  });


  it("validates that sleepMs is >= 0", async () => {
    const submitAction = jest.fn();

    render(
      <Router  >
        <TestJobsForm jobs={jobsFixtures.sixJobs}/>
      </Router  >
    );

    expect(await screen.findByTestId("TestJobForm-fail")).toBeInTheDocument();
    const submitButton = screen.getByTestId("TestJobForm-Submit-Button");
    const sleepMs = screen.getByTestId("TestJobForm-sleepMs");

    expect(submitButton).toBeInTheDocument();
    expect(sleepMs).toHaveValue(1000);

    fireEvent.change(sleepMs, { target: { value: '-1' } })
    fireEvent.click(submitButton);
    expect(await screen.findByText(/sleepMs must be positive/i)).toBeInTheDocument();
    expect(submitAction).not.toBeCalled();
  });


  it("validates that sleepMs is <= 60000", async () => {
    const submitAction = jest.fn();

    render(
      <Router  >
        <TestJobsForm jobs={jobsFixtures.sixJobs}/>
      </Router  >
    );

    expect(await screen.findByTestId("TestJobForm-fail")).toBeInTheDocument();
    const submitButton = screen.getByTestId("TestJobForm-Submit-Button");
    const sleepMs = screen.getByTestId("TestJobForm-sleepMs");

    expect(submitButton).toBeInTheDocument();
    expect(sleepMs).toHaveValue(1000);

    fireEvent.change(sleepMs, { target: { value: '70000' } })
    fireEvent.click(submitButton);
    expect(await screen.findByText(/sleepMs must be ≤ 60000/i)).toBeInTheDocument();
    expect(submitAction).not.toBeCalled();
  });
});
