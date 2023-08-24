import { render, screen } from "@testing-library/react";
import { MemoryRouter as Router } from "react-router-dom";
import InstructorReportForm from "main/components/Jobs/InstructorReportForm";
import jobsFixtures from "fixtures/jobsFixtures";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate
}));

describe("InstructorReportForm tests", () => {
  it("button generates correctly", async () => {
    render(
      <Router  >
        <InstructorReportForm jobs={jobsFixtures.formJob}/>
      </Router  >
    );
    const submitButton = screen.getByTestId("InstructorReport-Submit-Button");
    expect(submitButton).toBeInTheDocument();
  });

});
