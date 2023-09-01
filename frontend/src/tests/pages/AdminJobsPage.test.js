import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import AdminJobsPage from "main/pages/AdminJobsPage";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import pagedJobsFixtures from "fixtures/pagedJobsFixtures";
import commonsFixtures from "../../fixtures/commonsFixtures";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

describe("AdminJobsPage tests", () => {
  let queryClient = new QueryClient();
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    queryClient = new QueryClient();
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.adminUser);
    axiosMock.onGet("/api/jobs/all/pageable").reply(200, pagedJobsFixtures.onePage);

    // see: https://ucsb-cs156.github.io/topics/testing/testing_jest.html#hiding-the-wall-of-red
    jest.spyOn(console, 'error')
    console.error.mockImplementation(() => null);
  });

  afterEach(() => {
     // see: https://ucsb-cs156.github.io/topics/testing/testing_jest.html#hiding-the-wall-of-red
    console.error.mockRestore()
  })


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
    expect(await screen.findByText("Set Cow Health for a Specific Commons")).toBeInTheDocument();
    expect(await screen.findByText("Update Cow Health")).toBeInTheDocument();
    expect(await screen.findByText("Milk The Cows")).toBeInTheDocument();
    expect(await screen.findByText("Instructor Report")).toBeInTheDocument();  
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

    expect(mockToast).toHaveBeenCalledWith("Submitted job: Test Job");
  });

  test("user can submit a set cow health job", async () => {
    axiosMock.onGet("/api/commons/all").reply(200, commonsFixtures.threeCommons);

    const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
    getItemSpy.mockImplementation(() => null);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const setCowHealthButton = await screen.findByText("Set Cow Health for a Specific Commons")
    expect(setCowHealthButton).toBeInTheDocument();
    setCowHealthButton.click();

    const commonsRadio = await screen.findByTestId("SetCowHealthForm-commons-1");
    expect(commonsRadio).toBeInTheDocument();
    fireEvent.click(commonsRadio);

    const healthInput = screen.getByTestId("SetCowHealthForm-healthValue");
    const submitButton = screen.getByTestId("SetCowHealthForm-Submit-Button");

    expect(healthInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();

    fireEvent.change(healthInput, { target: { value: "10" } });
    submitButton.click();

    await waitFor(() => {
      expect(axiosMock.history.post[0].url).toBe(
        `/api/jobs/launch/setcowhealth?commonsID=1&health=10`
      );
    })

    expect(mockToast).toHaveBeenCalledWith(`Submitted Job: Set Cow Health (Commons: Anika's Commons, Health: 10)`);

  });

  test("user can submit update cow health job", async () => {
    axiosMock.onGet("/api/commons/all").reply(200, commonsFixtures.threeCommons);

    const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
    getItemSpy.mockImplementation(() => null);

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
    
    const commonsRadio = await screen.findByTestId("UpdateCowHealthForm-commons-1");
    expect(commonsRadio).toBeInTheDocument();
    fireEvent.click(commonsRadio);
    
    const submitButton = screen.getByTestId("UpdateCowHealthForm-Submit-Button");

    expect(submitButton).toBeInTheDocument();
    
    submitButton.click();

    await waitFor(() => {
      expect(axiosMock.history.post[0].url).toBe(
        `/api/jobs/launch/updatecowhealthsinglecommons?commonsId=1`
      );
    })

    expect(mockToast).toHaveBeenCalledWith(`Submitted Job: Update Cow Health (Commons: Anika's Commons)`);

  });

  test("user can submit update cow health job for all commons", async () => {
    axiosMock.onGet("/api/commons/all").reply(200, commonsFixtures.threeCommons);

    const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
    getItemSpy.mockImplementation(() => null);

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
    
    const commonsRadio = await screen.findByTestId("UpdateCowHealthForm-commons-0");
    expect(commonsRadio).toBeInTheDocument();
    fireEvent.click(commonsRadio);
    
    const submitButton = screen.getByTestId("UpdateCowHealthForm-Submit-Button");

    expect(submitButton).toBeInTheDocument();
    
    submitButton.click();

    await waitFor(() => {
      expect(axiosMock.history.post[0].url).toBe(
        `/api/jobs/launch/updatecowhealth`
      );
    })

    expect(mockToast).toHaveBeenCalledWith(`Submitted Job: Update Cow Health`);

  });

  test("user can submit milk the cows job", async () => {
    axiosMock.onGet("/api/commons/all").reply(200, commonsFixtures.threeCommons);

    const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
    getItemSpy.mockImplementation(() => null);

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

    const commonsRadio = await screen.findByTestId("MilkTheCowsForm-commons-1");
    expect(commonsRadio).toBeInTheDocument();
    fireEvent.click(commonsRadio);

    const submitButton = screen.getByTestId("MilkTheCowsForm-Submit-Button");
    expect(submitButton).toBeInTheDocument();
    submitButton.click();

    await waitFor(() => {
      expect(axiosMock.history.post[0].url).toBe(
        `/api/jobs/launch/milkthecowjobsinglecommons?commonsId=1`
      );
    })

    expect(mockToast).toHaveBeenCalledWith(`Submitted Job: Milk The Cows! (Commons: Anika's Commons)`);
  });

  test("user can submit milk the cows job for all commons", async () => {
    axiosMock.onGet("/api/commons/all").reply(200, commonsFixtures.threeCommons);

    const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
    getItemSpy.mockImplementation(() => null);

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

    const commonsRadio = await screen.findByTestId("MilkTheCowsForm-commons-0");
    expect(commonsRadio).toBeInTheDocument();
    fireEvent.click(commonsRadio);

    const submitButton = screen.getByTestId("MilkTheCowsForm-Submit-Button");
    expect(submitButton).toBeInTheDocument();
    submitButton.click();

    await waitFor(() => {
      expect(axiosMock.history.post[0].url).toBe(
        `/api/jobs/launch/milkthecowjob`
      );
    })

    expect(mockToast).toHaveBeenCalledWith("Submitted Job: Milk The Cows!");
  });


  test("user can submit instructor report job", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(await screen.findByText("Instructor Report")).toBeInTheDocument();

    const InstructorReportJobButton = screen.getByText("Instructor Report");
    expect(InstructorReportJobButton).toBeInTheDocument();
    InstructorReportJobButton.click();

    const submitButton = screen.getByTestId("InstructorReport-Submit-Button");

    expect(submitButton).toBeInTheDocument();
    submitButton.click();

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].url).toBe(
      "/api/jobs/launch/instructorreport"
    );


    await waitFor( () => {
      expect(mockToast).toHaveBeenCalledWith('Submitted Job: Instructor Report');
      }
    );
  });

  test("user can submit instructor report (specific commons) job", async () => {
    
    // arrange
    axiosMock.onGet("/api/commons/all").reply(200, commonsFixtures.threeCommons);

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert
    const label = "Instructor Report (for specific commons)";
    expect(await screen.findByText(label)).toBeInTheDocument();

    const InstructorReportJobButton = screen.getByText(label);
    expect(InstructorReportJobButton).toBeInTheDocument();
    InstructorReportJobButton.click();

    expect(screen.queryByText("There are no commons on which to run this job.")).not.toBeInTheDocument();

    const submitButton = await screen.findByTestId("InstructorReportSpecificCommonsForm-Submit-Button");
    expect(submitButton).toBeInTheDocument();
    submitButton.click();

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    await waitFor(() => {
      expect(axiosMock.history.post[0].url).toBe(
        `/api/jobs/launch/instructorreportsinglecommons?commonsId=5`
      );
    })

    await waitFor( () => {
      expect(mockToast).toHaveBeenCalledWith('Submitted Job: Instructor Report (Specific Commons)');
      }
    );
  });
});
