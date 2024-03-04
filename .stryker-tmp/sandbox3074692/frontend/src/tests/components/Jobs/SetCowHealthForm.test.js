import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter as Router } from "react-router-dom";
import SetCowHealthForm from "main/components/Jobs/SetCowHealthForm";
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

describe("SetCowHealthForm tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  it("renders the fallback text correctlyl", async () => {

    axiosMock
      .onGet("/api/commons/all")
      .reply(200, []);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <Router>
          <SetCowHealthForm />
        </Router>
      </QueryClientProvider>
    );

    expect(
      await screen.findByText("There are no commons on which to run this job.")
    ).toBeInTheDocument();
  });

  it("validates health > 0", async () => {
    const submitAction = jest.fn();
    axiosMock
      .onGet("/api/commons/all")
      .reply(200, commonsFixtures.threeCommons);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <Router>
          <SetCowHealthForm  />
        </Router>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("SetCowHealthForm-healthValue")).toBeInTheDocument();
    });

    const submitButton = screen.getByTestId("SetCowHealthForm-Submit-Button");
    const healthInput = screen.getByTestId("SetCowHealthForm-healthValue");

    expect(submitButton).toBeInTheDocument();
    expect(healthInput).toHaveValue(100);

    fireEvent.change(healthInput, { target: { value: "-1" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Health Value must be ≥ 0/i)).toBeInTheDocument();
    });
    expect(submitAction).not.toBeCalled();
  });

  it("validates health ≥ 0", async () => {
    const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
    getItemSpy.mockImplementation(() => null);

    const submitAction = jest.fn();
    axiosMock
      .onGet("/api/commons/all")
      .reply(200, commonsFixtures.threeCommons);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <Router>
          <SetCowHealthForm  />
        </Router>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("SetCowHealthForm-healthValue")).toBeInTheDocument();
    });

    const submitButton = screen.getByTestId("SetCowHealthForm-Submit-Button");
    const healthInput = screen.getByTestId("SetCowHealthForm-healthValue");

    expect(submitButton).toBeInTheDocument();
    expect(healthInput).toHaveValue(100);

    fireEvent.change(healthInput, { target: { value: "-1" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Health Value must be ≥ 0/i)).toBeInTheDocument();
    });
    expect(submitAction).not.toBeCalled();
  });

  it("validates health ≤ 100", async () => {
    const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
    getItemSpy.mockImplementation(() => null);

    const submitAction = jest.fn();
    axiosMock
      .onGet("/api/commons/all")
      .reply(200, commonsFixtures.threeCommons);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <Router>
          <SetCowHealthForm />
        </Router>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("SetCowHealthForm-healthValue")).toBeInTheDocument();
    });

    const submitButton = screen.getByTestId("SetCowHealthForm-Submit-Button");
    const healthInput = screen.getByTestId("SetCowHealthForm-healthValue");

    expect(submitButton).toBeInTheDocument();
    expect(healthInput).toHaveValue(100);

    fireEvent.change(healthInput, { target: { value: "101" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Health Value must be ≤ 100/i)).toBeInTheDocument();
    });
    expect(submitAction).not.toBeCalled();
  });


  it("validates health is required", async () => {

    const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
    getItemSpy.mockImplementation(() => null);

    const submitAction = jest.fn();
    axiosMock
      .onGet("/api/commons/all")
      .reply(200, commonsFixtures.threeCommons);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <Router>
          <SetCowHealthForm />
        </Router>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("SetCowHealthForm-healthValue")).toBeInTheDocument();
    });

    const submitButton = screen.getByTestId("SetCowHealthForm-Submit-Button");
    const healthInput = screen.getByTestId("SetCowHealthForm-healthValue");

    expect(submitButton).toBeInTheDocument();
    expect(healthInput).toHaveValue(100);

    fireEvent.change(healthInput, { target: { value: "" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Health Value is required/i)).toBeInTheDocument();
    });
    expect(submitAction).not.toBeCalled();
  });


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
          <SetCowHealthForm
            submitAction={submitAction}
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
    fireEvent.click(submitButton);

    // assert - check that the console.log was called with the expected message
    await waitFor(() => {
      expect(submitAction).toHaveBeenCalled();
    });

    expect(submitAction).toHaveBeenCalledWith(
      {
        "healthValue": "10",
        "selectedCommons": 1,
        "selectedCommonsName": "Anika's Commons"
      }
    );
  });

  test("when localstorage has no value, the default value of healthValue is 100", async () => {
    const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
    getItemSpy.mockImplementation(() => null);
    axiosMock
      .onGet("/api/commons/all")
      .reply(200, commonsFixtures.threeCommons);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <Router>
          <SetCowHealthForm />
        </Router>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("SetCowHealthForm-healthValue")).toBeInTheDocument();
    });

    const healthInput = screen.getByTestId("SetCowHealthForm-healthValue");
    expect(healthInput).toHaveValue(100);

  });

  test("healthValue can be loaded from localstorage", async () => {
    const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
    getItemSpy.mockImplementation((key) => (key === "SetCowHealthForm-health" ? 42 : null));
    axiosMock
      .onGet("/api/commons/all")
      .reply(200, commonsFixtures.threeCommons);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <Router>
          <SetCowHealthForm />
        </Router>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("SetCowHealthForm-healthValue")).toBeInTheDocument();
    });

    const healthInput = screen.getByTestId("SetCowHealthForm-healthValue");
    expect(healthInput).toHaveValue(42);
  });


  test("healthValue is saved in localstorage", async () => {
    const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    getItemSpy.mockImplementation((key) => (key === "SetCowHealthForm-health" ? 42 : null));

    axiosMock
      .onGet("/api/commons/all")
      .reply(200, commonsFixtures.threeCommons);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <Router>
          <SetCowHealthForm  />
        </Router>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("SetCowHealthForm-healthValue")).toBeInTheDocument();
    });

    const healthInput = screen.getByTestId("SetCowHealthForm-healthValue");
    expect(healthInput).toHaveValue(42);

    const submitButton = screen.getByTestId("SetCowHealthForm-Submit-Button");


    fireEvent.change(healthInput, { target: { value: "24" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(setItemSpy).toHaveBeenCalledWith("SetCowHealthForm-health", "24");
    });
  });

  test("the first item in commons array is selected by default", async () => {
    const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
    getItemSpy.mockImplementation((key) => (key === "SetCowHealthForm-health" ? 42 : null));

    axiosMock
      .onGet("/api/commons/all")
      .reply(200, commonsFixtures.threeCommons);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <Router>
          <SetCowHealthForm  />
        </Router>
      </QueryClientProvider>
    );

    const defaultId = commonsFixtures.threeCommons[0].id;
    const testIdForFirstItem = `SetCowHealthForm-commons-${defaultId}`;
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
          <SetCowHealthForm />
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
