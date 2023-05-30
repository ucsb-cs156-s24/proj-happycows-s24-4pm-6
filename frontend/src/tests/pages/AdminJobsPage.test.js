import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import AdminJobsPage from "main/pages/AdminJobsPage";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import jobsFixtures from "fixtures/jobsFixtures";
import mockConsole from "jest-mock-console";

describe("AdminJobsPage tests", () => {
  const queryClient = new QueryClient();
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.adminUser);
    axiosMock.onGet("/api/jobs/all").reply(200, jobsFixtures.sixJobs);
  });

  test("renders without crashing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );
    expect(await screen.findByText("Launch Jobs")).toBeInTheDocument();
    expect(await screen.findByText("Job Status")).toBeInTheDocument();

    expect(await screen.findByText("Test Job")).toBeInTheDocument();
    expect(await screen.findByText("Set Cow Health")).toBeInTheDocument();
    expect(await screen.findByText("Update Cow Health")).toBeInTheDocument();
    expect(await screen.findByText("Milk The Cows")).toBeInTheDocument();
    expect(await screen.findByText("Instructor Report")).toBeInTheDocument();

    const testId = "JobsTable";

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      "1"
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-Created`)
    ).toHaveTextContent("11/13/2022, 19:49:58");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-Updated`)
    ).toHaveTextContent("11/13/2022, 19:49:59");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-status`)
    ).toHaveTextContent("complete");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-Log`)
    ).toHaveTextContent("Hello World! from test job!Goodbye from test job!");
  });

  test("user can submit a test job", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(await screen.findByText("Test Job")).toBeInTheDocument();

    const testJobButton = screen.getByText("Test Job");
    expect(testJobButton).toBeInTheDocument();
    testJobButton.click();

    expect(await screen.findByTestId("TestJobForm-fail")).toBeInTheDocument();

    const sleepMsInput = screen.getByTestId("TestJobForm-sleepMs");
    const submitButton = screen.getByTestId("TestJobForm-Submit-Button");

    expect(sleepMsInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();

    fireEvent.change(sleepMsInput, { target: { value: "0" } });
    submitButton.click();

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].url).toBe(
      "/api/jobs/launch/testjob?fail=false&sleepMs=0"
    );
  });

  test("user can submit a set cow health job", async () => {
    const restoreConsole = mockConsole();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(await screen.findByText("Change Cow Health")).toBeInTheDocument();

    const setCowHealthButton = screen.getByText("Change Cow Health");
    expect(setCowHealthButton).toBeInTheDocument();
    setCowHealthButton.click();

    //expect(await screen.findByTestId("TestJobForm-fail")).toBeInTheDocument();

    const healthInput = screen.getByTestId("SetCowHealthForm-healthValue");
    const submitButton = screen.getByTestId("SetCowHealthForm-Submit-Button");

    expect(healthInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();

    fireEvent.change(healthInput, { target: { value: "10" } });
    submitButton.click();

    // assert - check that the console.log was called with the expected message
    expect(console.log).toHaveBeenCalled();
    const message = console.log.mock.calls[0][0];
    const expectedMessage = `Submitted: SetCowHealthJob, data=`;
    expect(message).toBe(expectedMessage);
    restoreConsole();
  });

  test("user can submit update cow health job", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(await screen.findByText("Update Cow Health")).toBeInTheDocument();

    const UpdateCowHealthJobButton = screen.getByText("Update Cow Health");
    expect(UpdateCowHealthJobButton).toBeInTheDocument();
    UpdateCowHealthJobButton.click();

    const submitButton = screen.getByTestId(
      "UpdateCowHealthForm-Submit-Button"
    );

    expect(submitButton).toBeInTheDocument();
    submitButton.click();

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].url).toBe(
      "/api/jobs/launch/updatecowhealth"
    );
  });

  test("user can submit milk the cows job", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(await screen.findByText("Milk The Cows")).toBeInTheDocument();

    const MilkTheCowsJobButton = screen.getByText("Milk The Cows");
    expect(MilkTheCowsJobButton).toBeInTheDocument();
    MilkTheCowsJobButton.click();

    const submitButton = screen.getByTestId("MilkTheCowsForm-Submit-Button");

    expect(submitButton).toBeInTheDocument();
    submitButton.click();

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].url).toBe(
      "/api/jobs/launch/milkthecowjob"
    );
  });
});
