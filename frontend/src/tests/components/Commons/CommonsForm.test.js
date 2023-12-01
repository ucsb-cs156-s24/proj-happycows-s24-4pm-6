import { fireEvent, render, screen, waitFor} from "@testing-library/react";
import { MemoryRouter as Router } from "react-router-dom";
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
    const submitAction = jest.fn();

    axiosMock
      .onGet("/api/commons/all-health-update-strategies")
      .reply(200, healthUpdateStrategyListFixtures.real);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <Router>
          <CommonsForm submitAction={submitAction}  />
        </Router>
      </QueryClientProvider>
    );

    expect(await screen.findByText(/Commons Name/)).toBeInTheDocument();

    [
      /Starting Balance/,
      /Cow Price/,
      /Milk Price/,
      /Starting Date/,
      /Last Date/,
      /Degradation Rate/,
      /Capacity Per User/,
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
    expect(screen.getByTestId("CommonsForm-Submit-Button")).toHaveTextContent("Create");

  });


  it("has validation errors for required fields", async () => {
    const submitAction = jest.fn();

    axiosMock
      .onGet("/api/commons/all-health-update-strategies")
      .reply(200, healthUpdateStrategyListFixtures.real);


    render(
      <QueryClientProvider client={new QueryClient()}>
        <Router>
          <CommonsForm submitAction={submitAction} buttonLabel="Create New Commons" />
        </Router>
      </QueryClientProvider>
    );

    expect(await screen.findByTestId("CommonsForm-name")).toBeInTheDocument();
    const submitButton = screen.getByTestId("CommonsForm-Submit-Button");
    expect(submitButton).toBeInTheDocument();
    expect(screen.getByTestId("CommonsForm-Submit-Button")).toHaveTextContent("Create New Commons");

    fireEvent.change(screen.getByTestId("CommonsForm-degradationRate"), { target: { value: "" } });
    fireEvent.change(screen.getByTestId("CommonsForm-carryingCapacity"), { target: { value: "" } });

    //Check default empty field
    fireEvent.click(submitButton);
    expect(await screen.findByText('Commons name is required')).toBeInTheDocument();
    expect(screen.getByText('Degradation rate is required')).toBeInTheDocument();
    expect(screen.getByText('Carrying capacity is required')).toBeInTheDocument();
    expect(screen.getByText('Capacity Per User is required')).toBeInTheDocument();

    //Clear Default Values
    fireEvent.change(screen.getByTestId("CommonsForm-milkPrice"), { target: { value: "" } });
    fireEvent.change(screen.getByTestId("CommonsForm-cowPrice"), { target: { value: "" } });
    fireEvent.change(screen.getByTestId("CommonsForm-startingBalance"), { target: { value: "" } });
    expect(await screen.findByText('Cow price is required')).toBeInTheDocument();
    expect(screen.getByText('Milk price is required')).toBeInTheDocument();
    expect(screen.getByText('Starting Balance is required')).toBeInTheDocument();

    //Reset to Invalid Values
    fireEvent.change(screen.getByTestId("CommonsForm-milkPrice"), { target: { value: "-1" } });
    fireEvent.change(screen.getByTestId("CommonsForm-cowPrice"), { target: { value: "-1" } });
    fireEvent.change(screen.getByTestId("CommonsForm-startingBalance"), { target: { value: "-1" } });
    fireEvent.change(screen.getByTestId("CommonsForm-startingDate"), { target: { value: NaN } });
    fireEvent.change(screen.getByTestId("CommonsForm-lastDate"), { target: { value: NaN } });
    fireEvent.click(submitButton);

    //Await
    await screen.findByTestId('CommonsForm-milkPrice');

    [
      "CommonsForm-name",
      "CommonsForm-degradationRate",
      "CommonsForm-capacityPerUser",
      "CommonsForm-carryingCapacity",
      "CommonsForm-milkPrice",
      "CommonsForm-cowPrice",
      "CommonsForm-startingBalance",
      "CommonsForm-startingDate",
      "CommonsForm-lastDate",

    ].forEach(
      (item) => {
        const element = screen.getByTestId(item);
        expect(element).toBeInTheDocument();
        expect(element).toHaveClass("is-invalid");
      }
    );

    // check that the other testids are present

    [
      "CommonsForm-showLeaderboard",
    ].forEach(
      (testid) => {
        const element = screen.getByTestId(testid);
        expect(element).toBeInTheDocument();
      }
    );

    expect(submitAction).not.toBeCalled();
  });



  it("Check Default Values and correct styles", async () => {

    const curr = new Date();
    const today = curr.toISOString().substr(0, 10);
    const currMonth = curr.getMonth() % 12;
    const nextMonth = new Date(curr.getFullYear(), currMonth + 1, curr.getDate()).toISOString().substr(0, 10);
    const DefaultVals = {
      name: "", startingBalance: 10000, cowPrice: 100,
      milkPrice: 1, degradationRate: 0.001, carryingCapacity: 100, startingDate: today, lastDate: nextMonth
    };

    axiosMock
        .onGet("/api/commons/all-health-update-strategies")
        .reply(200, healthUpdateStrategyListFixtures.real);

    render(
        <QueryClientProvider client={new QueryClient()}>
          <Router>
            <CommonsForm  />
          </Router>
        </QueryClientProvider>
    );

    expect(await screen.findByTestId("CommonsForm-name")).toBeInTheDocument();
    [
      "name", "degradationRate", "carryingCapacity",
      "milkPrice","cowPrice","startingBalance","startingDate", "lastDate",
    ].forEach(
        (item) => {
          const element = screen.getByTestId(`CommonsForm-${item}`);
          expect(element).toHaveValue(DefaultVals[item]);
        }
    );

    // Check Style
    expect(screen.getByTestId("CommonsForm-r0")).toHaveStyle('width: 80%');
    expect(screen.getByTestId("CommonsForm-r1")).toHaveStyle('width: 80%');
    expect(screen.getByTestId("CommonsForm-r2")).toHaveStyle('width: 80%');
    expect(screen.getByTestId("CommonsForm-r3")).toHaveStyle('width: 300px');
    expect(screen.getByTestId("CommonsForm-r3")).toHaveStyle('height: 50px');
    expect(screen.getByTestId("CommonsForm-r4")).toHaveStyle('width: 300px');
    expect(screen.getByTestId("CommonsForm-r4")).toHaveStyle('height: 50px');
    expect(screen.getByTestId("CommonsForm-Submit-Button")).toHaveStyle('width: 30%');
  });


  it("has validation errors for values out of range", async () => {
    const submitAction = jest.fn();

    axiosMock
      .onGet("/api/commons/all-health-update-strategies")
      .reply(200, healthUpdateStrategyListFixtures.real);


    render(
      <QueryClientProvider client={new QueryClient()}>
        <Router>
          <CommonsForm submitAction={submitAction} buttonLabel="Create" />
        </Router>
      </QueryClientProvider>
    );

    expect(await screen.findByTestId("CommonsForm-Submit-Button")).toBeInTheDocument();
    const submitButton = screen.getByTestId("CommonsForm-Submit-Button");
    expect(submitButton).toBeInTheDocument();


    fireEvent.change(screen.getByTestId("CommonsForm-startingBalance"), { target: { value: "-1" } });
    fireEvent.click(submitButton);
    await screen.findByText(/Starting Balance must be ≥ 0.00/i);

    fireEvent.change(screen.getByTestId("CommonsForm-cowPrice"), { target: { value: "-1" } });
    fireEvent.click(submitButton);
    await screen.findByText(/Cow price must be ≥ 0.01/i);

    fireEvent.change(screen.getByTestId("CommonsForm-milkPrice"), { target: { value: "-1" } });
    fireEvent.click(submitButton);
    await screen.findByText(/Milk price must be ≥ 0.01/i);

    fireEvent.change(screen.getByTestId("CommonsForm-degradationRate"), { target: { value: "-1" } });
    fireEvent.click(submitButton);
    await screen.findByText(/Degradation rate must be ≥ 0/i);

    fireEvent.change(screen.getByTestId("CommonsForm-carryingCapacity"), { target: { value: "-1" } });
    fireEvent.click(submitButton);
    await screen.findByText(/Carrying Capacity must be ≥ 1/i);


    expect(submitAction).not.toBeCalled();
  });


  it("renders correctly when an initialCommons is passed in", async () => {

    axiosMock
      .onGet("/api/commons/all-health-update-strategies")
      .reply(200, healthUpdateStrategyListFixtures.real);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <Router>
          <CommonsForm initialCommons={commonsFixtures.threeCommons[0]} />
        </Router>
      </QueryClientProvider>
    );

    expect(await screen.findByText(/Id/)).toBeInTheDocument();


    expect(screen.getByTestId("CommonsForm-id")).toHaveValue(`${commonsFixtures.threeCommons[0].id}`);
    expect(screen.getByTestId("CommonsForm-name")).toHaveValue(commonsFixtures.threeCommons[0].name);
    expect(screen.getByTestId("CommonsForm-startingBalance")).toHaveValue(commonsFixtures.threeCommons[0].startingBalance);
    expect(screen.getByTestId("CommonsForm-cowPrice")).toHaveValue(commonsFixtures.threeCommons[0].cowPrice);

    expect(screen.getByTestId("aboveCapacityHealthUpdateStrategy-Noop")).toBeInTheDocument();
    expect(screen.getByTestId("belowCapacityHealthUpdateStrategy-Noop")).toBeInTheDocument();
  });

  it("renders correctly with date cut off", async () => {
    axiosMock
      .onGet("/api/commons/all-health-update-strategies")
      .reply(200, healthUpdateStrategyListFixtures.real);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <Router>
          <CommonsForm initialCommons={commonsFixtures.threeCommons[0]} />
        </Router>
      </QueryClientProvider>
    );

    expect(await screen.findByText(/Id/)).toBeInTheDocument();
    expect(screen.getByTestId("CommonsForm-startingDate")).toHaveValue(commonsFixtures.threeCommons[0].startingDate.split("T")[0]);
  });

  it("renders correctly when an initialCommons is not passed in", async () => {
    const curr = new Date();
    const today = curr.toISOString().substr(0, 10);
    const currMonth = curr.getMonth() % 12;
    const nextMonth = new Date(curr.getFullYear(), currMonth + 1, curr.getDate()).toISOString().substr(0, 10);
    const DefaultVals = {
      name: "", startingBalance: 10000, cowPrice: 100,
      milkPrice: 1, degradationRate: 0.001, carryingCapacity: 100, startingDate: today, lastDate: nextMonth, aboveCapacityStrategy: "Linear", belowCapacityStrategy: "Constant"
    };
    axiosMock
      .onGet("/api/commons/all-health-update-strategies")
      .reply(200, healthUpdateStrategyListFixtures.real);
    axiosMock
      .onGet("/api/commons/defaults")
      .reply(200, DefaultVals);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <Router>
          <CommonsForm />
        </Router>
      </QueryClientProvider>
    );

    expect(await screen.findByTestId("CommonsForm-name")).toBeInTheDocument();
    [
      "name", "degradationRate", "carryingCapacity",
      "milkPrice","cowPrice","startingBalance","startingDate", "lastDate",
    ].forEach(
        (item) => {
          const element = screen.getByTestId(`CommonsForm-${item}`);
          expect(element).toHaveValue(DefaultVals[item]);
        }
    );
    expect(await screen.findByText(/When below capacity/)).toBeInTheDocument();

    expect(screen.getByTestId("aboveCapacityHealthUpdateStrategy-Linear")).toBeInTheDocument();
    expect(screen.getByTestId("aboveCapacityHealthUpdateStrategy-Linear")).toHaveAttribute("selected");
    expect(screen.getByTestId("belowCapacityHealthUpdateStrategy-Constant")).toBeInTheDocument();
    expect(screen.getByTestId("belowCapacityHealthUpdateStrategy-Constant")).toHaveAttribute("selected");


  });

test("the correct parameters are passed to useBackend", async () => {

    axiosMock
      .onGet("/api/commons/all-health-update-strategies")
      .reply(200, healthUpdateStrategyListFixtures.real);

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

  test("populates form fields with default values when initialCommons is not provided", async () => {

    const curr = new Date();
    const today = curr.toISOString().substr(0, 10);
    const currMonth = curr.getMonth() % 12;
    const nextMonth = new Date(curr.getFullYear(), currMonth + 1, curr.getDate()).toISOString().substr(0, 10);
    const defaultValuesData = {
      name: "", startingBalance: 10000, cowPrice: 100,
      milkPrice: 1, degradationRate: 0.001, carryingCapacity: 100, startingDate: today, lastDate: nextMonth
    };

    jest.spyOn(useBackendModule, 'useBackend').mockReturnValue({ data: defaultValuesData });

    jest.spyOn(useBackendModule, 'useBackend').mockReturnValue({ data: healthUpdateStrategyListFixtures.real });

    render(
      <QueryClientProvider client={new QueryClient()}>
        <Router>
          <CommonsForm />
        </Router>
      </QueryClientProvider>
    );
  
    expect(await screen.findByTestId("CommonsForm-startingBalance")).toHaveValue(defaultValuesData.startingBalance);
    expect(screen.getByTestId("CommonsForm-name")).toHaveValue(defaultValuesData.name);
    expect(screen.getByTestId("CommonsForm-cowPrice")).toHaveValue(defaultValuesData.cowPrice);
    expect(screen.getByTestId("CommonsForm-milkPrice")).toHaveValue(defaultValuesData.milkPrice);
    expect(screen.getByTestId("CommonsForm-degradationRate")).toHaveValue(defaultValuesData.degradationRate);
    expect(screen.getByTestId("CommonsForm-carryingCapacity")).toHaveValue(defaultValuesData.carryingCapacity);
    expect(screen.getByTestId("CommonsForm-startingDate")).toHaveValue(defaultValuesData.startingDate);
    expect(screen.getByTestId("CommonsForm-lastDate")).toHaveValue(defaultValuesData.lastDate);
  });

});