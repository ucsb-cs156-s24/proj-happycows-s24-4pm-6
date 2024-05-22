import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import PagedProfitsTable from "main/components/Commons/PagedProfitsTable";

import pagedProfitsFixtures from "fixtures/pagedProfitsFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

describe("PagedProfitsTable tests", () => {
    
  const queryClient = new QueryClient();

  const axiosMock = new AxiosMockAdapter(axios);

  const testId = "PagedProfitsTable";

  beforeEach(() => {
    axiosMock.reset();
    axiosMock.resetHistory();
  });



  test("renders correct content", async () => {

    // arrange

    axiosMock.onGet("/api/profits/paged/commonsid").reply(200, pagedProfitsFixtures.onePage);

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PagedProfitsTable />
        </MemoryRouter>
      </QueryClientProvider>

    );

    // assert
    const expectedHeaders = ['Profit', 'Date', 'Health', 'Cows'];
    const expectedFields = ['amount', 'timestamp', 'avgCowHealth', 'numCows'];

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

    expect(axiosMock.history.get[0].url).toBe("/api/profits/paged/commonsid");
    expect(axiosMock.history.get[0].params).toEqual({commonsId: undefined, pageNumber: 0, pageSize: 5 });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-amount`)).toHaveTextContent(
      "120");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-timestamp`)
    ).toHaveTextContent("2023-05-16");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-avgCowHealth`)
    ).toHaveTextContent("91.00%");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-numCows`)
    ).toHaveTextContent("6");
    
      
    expect(screen.getByTestId(`${testId}-header-timestamp-sort-carets`)).toHaveTextContent("🔽");


    const nextButton = screen.getByTestId(`${testId}-next-button`);
    expect(nextButton).toBeInTheDocument();
    expect(nextButton).toBeDisabled();

    const previousButton = screen.getByTestId(`${testId}-previous-button`);
    expect(previousButton).toBeInTheDocument();
    expect(previousButton).toBeDisabled();
  });

   test("buttons are disabled where there are zero pages", async () => {

    // arrange

    axiosMock.onGet("/api/profits/paged/commonsid").reply(200, pagedProfitsFixtures.emptyPage);

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PagedProfitsTable />
        </MemoryRouter>
      </QueryClientProvider>

    );

    await waitFor(() => {
      expect(axiosMock.history.get.length).toBe(1);
    });

    expect(axiosMock.history.get[0].url).toBe("/api/profits/paged/commonsid");
    expect(axiosMock.history.get[0].params).toEqual({ commonsId:undefined, pageNumber: 0, pageSize: 5 });

    const nextButton = screen.getByTestId(`${testId}-next-button`);
    expect(nextButton).toBeInTheDocument();
    expect(nextButton).toBeDisabled();

    const previousButton = screen.getByTestId(`${testId}-previous-button`);
    expect(previousButton).toBeInTheDocument();
    expect(previousButton).toBeDisabled();
  }); 





  test("renders correct content with multiple pages", async () => {
    // arrange

    axiosMock.onGet("/api/profits/paged/commonsid"   ,{ params: {commonsId: undefined, pageNumber: 0, pageSize: 5 } }   ).reply(200, pagedProfitsFixtures.twoPages[0]);
    axiosMock.onGet("/api/profits/paged/commonsid" ,{ params: {commonsId: undefined, pageNumber: 1, pageSize: 5 } }     ).reply(200, pagedProfitsFixtures.twoPages[1]);
    

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PagedProfitsTable />
        </MemoryRouter>
      </QueryClientProvider>

    );

    // assert
    const expectedHeaders = ['Profit', 'Date', 'Health', 'Cows'];
    const expectedFields = ['amount', 'timestamp', 'avgCowHealth', 'numCows'];

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

    expect(axiosMock.history.get[0].url).toBe("/api/profits/paged/commonsid");
    expect(axiosMock.history.get[0].params).toEqual({ commonsId: undefined, pageNumber: 0, pageSize: 5 });

    

    const nextButton = screen.getByTestId(`${testId}-next-button`);
    expect(nextButton).toBeInTheDocument();

    const previousButton = screen.getByTestId(`${testId}-previous-button`);
    expect(previousButton).toBeInTheDocument();

    expect(previousButton).toBeDisabled();
    expect(nextButton).toBeEnabled();

    expect(screen.getByText(`Page: 1`)).toBeInTheDocument();

    expect(
        screen.getByTestId(`${testId}-cell-row-0-col-amount`)
      ).toHaveTextContent("10");

    fireEvent.click(nextButton);


    await waitFor(() => {expect(screen.getByText(`Page: 2`)).toBeInTheDocument();});
    expect(previousButton).toBeEnabled();
    expect(nextButton).toBeDisabled();


    fireEvent.click(previousButton);
    await waitFor(() => { expect(screen.getByText(`Page: 1`)).toBeInTheDocument();});
    expect(previousButton).toBeDisabled();
    expect(nextButton).toBeEnabled(); 

     expect(
        screen.getByTestId(`${testId}-cell-row-0-col-amount`)
      ).toHaveTextContent("10"); 
    
    

  });

    
    });
