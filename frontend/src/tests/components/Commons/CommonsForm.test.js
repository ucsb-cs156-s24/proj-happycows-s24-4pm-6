import {fireEvent, render, screen} from "@testing-library/react";
import {BrowserRouter as Router} from "react-router-dom";
import CommonsForm from "main/components/Commons/CommonsForm";
import {QueryClient, QueryClientProvider} from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate
}));

describe("CommonsForm tests", () => {
  it("renders correctly", async () => {
    render(
        <QueryClientProvider client={new QueryClient()}>
          <Router>
            <CommonsForm/>
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

    render(
        <QueryClientProvider client={new QueryClient()}>
          <Router>
            <CommonsForm submitAction={submitAction} buttonLabel="Create"/>
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
});
