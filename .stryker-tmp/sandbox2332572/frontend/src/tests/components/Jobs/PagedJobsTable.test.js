import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import PagedJobsTable from "main/components/Jobs/PagedJobsTable";
import pagedJobsFixtures from "fixtures/pagedJobsFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

describe("PagedJobsTable tests", () => {
  const queryClient = new QueryClient();

  const axiosMock = new AxiosMockAdapter(axios);

  const testId = "PagedJobsTable";

  beforeEach(() => {
    axiosMock.reset();
    axiosMock.resetHistory();
  });

  test("renders correct content", async () => {

    // arrange

    axiosMock.onGet("/api/jobs/all/pageable").reply(200, pagedJobsFixtures.onePage);

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PagedJobsTable />
        </MemoryRouter>
      </QueryClientProvider>

    );

    // assert
    const expectedHeaders = ['id', 'Created', 'Updated', 'Status', 'Log'];
    const expectedFields = ['id', 'Created', 'Updated', 'status', 'Log'];

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(axiosMock.history.get.length).toBe(1);
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(axiosMock.history.get[0].url).toBe("/api/jobs/all/pageable");
    expect(axiosMock.history.get[0].params).toEqual({ page: 0, size: 10 });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      "1"
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-Created`)
    ).toHaveTextContent("8/8/2023, 12:14:00");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-Updated`)
    ).toHaveTextContent("8/8/2023, 12:14:00");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-status`)
    ).toHaveTextContent("complete");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-Log`)
    ).toHaveTextContent(`Updating cow health...Commons Blue, degradationRate: 0.1, carryingCapacity: 10User: Phill Conrad, numCows: 3, cowHealth: 100.0 old cow health: 100.0, new cow health: 100.0User: Phillip Conrad, numCows: 7, cowHealth: 100.0 old cow health: 100.0, new cow health: 100.0Commons Red, degradationRate: 0.1, carryingCapacity: 2User: Phill Conrad, numCows: 10, cowHealth: 54.40000000000016 old cow health: 54.40000000000016, new cow health: 53.600000000000165Cow health has been updated!`);

    expect(screen.getByTestId(`${testId}-header-id-sort-carets`)).toHaveTextContent("🔽");


    const nextButton = screen.getByTestId(`${testId}-next-button`);
    expect(nextButton).toBeInTheDocument();
    expect(nextButton).toBeDisabled();

    const previousButton = screen.getByTestId(`${testId}-previous-button`);
    expect(previousButton).toBeInTheDocument();
    expect(previousButton).toBeDisabled();
  });

  test("buttons are disabled where there are zero pages", async () => {

    // arrange

    axiosMock.onGet("/api/jobs/all/pageable").reply(200, pagedJobsFixtures.emptyPage);

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PagedJobsTable />
        </MemoryRouter>
      </QueryClientProvider>

    );

    await waitFor(() => {
      expect(axiosMock.history.get.length).toBe(1);
    });

    expect(axiosMock.history.get[0].url).toBe("/api/jobs/all/pageable");
    expect(axiosMock.history.get[0].params).toEqual({ page: 0, size: 10 });

    const nextButton = screen.getByTestId(`${testId}-next-button`);
    expect(nextButton).toBeInTheDocument();
    expect(nextButton).toBeDisabled();

    const previousButton = screen.getByTestId(`${testId}-previous-button`);
    expect(previousButton).toBeInTheDocument();
    expect(previousButton).toBeDisabled();
  });


  test("renders correct content with multiple pages", async () => {
    // arrange

    axiosMock.onGet("/api/jobs/all/pageable",  { params: { page: 0, size: 10 } }).reply(200, pagedJobsFixtures.fourPages[0]);
    axiosMock.onGet("/api/jobs/all/pageable",  { params: { page: 1, size: 10 } }).reply(200, pagedJobsFixtures.fourPages[1]);
    axiosMock.onGet("/api/jobs/all/pageable",  { params: { page: 2, size: 10 } }).reply(200, pagedJobsFixtures.fourPages[2]);
    axiosMock.onGet("/api/jobs/all/pageable",  { params: { page: 3, size: 10 } }).reply(200, pagedJobsFixtures.fourPages[3]);

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PagedJobsTable />
        </MemoryRouter>
      </QueryClientProvider>

    );

    // assert
    const expectedHeaders = ['id', 'Created', 'Updated', 'Status', 'Log'];
    const expectedFields = ['id', 'Created', 'Updated', 'status', 'Log'];

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(axiosMock.history.get.length).toBe(1);
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(axiosMock.history.get[0].url).toBe("/api/jobs/all/pageable");
    expect(axiosMock.history.get[0].params).toEqual({ page: 0, size: 10 });

    const nextButton = screen.getByTestId(`${testId}-next-button`);
    expect(nextButton).toBeInTheDocument();

    const previousButton = screen.getByTestId(`${testId}-previous-button`);
    expect(previousButton).toBeInTheDocument();

    expect(previousButton).toBeDisabled();
    expect(nextButton).toBeEnabled();

    expect(screen.getByText(`Page: 1`)).toBeInTheDocument();
    fireEvent.click(nextButton);

    await waitFor(() => {expect(screen.getByText(`Page: 2`)).toBeInTheDocument();});
    expect(previousButton).toBeEnabled();
    expect(nextButton).toBeEnabled();

    fireEvent.click(previousButton);
    await waitFor(() => { expect(screen.getByText(`Page: 1`)).toBeInTheDocument();});
    expect(previousButton).toBeDisabled();
    expect(nextButton).toBeEnabled();

    fireEvent.click(nextButton);
    await waitFor(() => { expect(screen.getByText(`Page: 2`)).toBeInTheDocument();});

    fireEvent.click(nextButton);
    await waitFor(() => { expect(screen.getByText(`Page: 3`)).toBeInTheDocument();});

    fireEvent.click(nextButton);
    await waitFor(() => { expect(screen.getByText(`Page: 4`)).toBeInTheDocument();});
    expect(previousButton).toBeEnabled();
    expect(nextButton).toBeDisabled();
  });

});

