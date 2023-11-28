import { render, screen, waitFor } from "@testing-library/react";
import Profits from "main/components/Commons/Profits"; 
import userCommonsFixtures from "fixtures/userCommonsFixtures"; 
import profitsFixtures from "fixtures/profitsFixtures";

describe("Profits tests", () => {
    test("renders properly for empty profits array", () => {
        render(
            <Profits userCommons={userCommonsFixtures.oneUserCommons[0]} profits={[]} />
        );
    });

    test("renders properly when profits is not defined", async () => {
        render(
            <Profits userCommons={userCommonsFixtures.oneUserCommons[0]}  />
        );
        await waitFor(()=>{
            expect(screen.getByTestId("ProfitsTable-header-Profit") ).toBeInTheDocument();
        });
    });

    test("renders properly when profits is non-empty", async () => {
        render(
            <Profits userCommons={userCommonsFixtures.oneUserCommons[0]} profits={profitsFixtures.threeProfits} />
        );
           
        expect(await screen.findByTestId("ProfitsTable-cell-row-0-col-Profit")).toBeInTheDocument();
        expect(screen.getByTestId("ProfitsTable-cell-row-0-col-Profit")).toHaveTextContent(/52.80/);
        expect(screen.getByTestId("ProfitsTable-cell-row-1-col-Profit")).toHaveTextContent(/54.60/);
        expect(screen.getByTestId("ProfitsTable-cell-row-2-col-Profit")).toHaveTextContent(/58.20/);

        expect(screen.getByTestId("ProfitsTable-cell-row-0-col-date")).toHaveTextContent(/2023-05-17/);
        expect(screen.getByTestId("ProfitsTable-cell-row-1-col-date")).toHaveTextContent(/2023-05-16/);
        expect(screen.getByTestId("ProfitsTable-cell-row-2-col-date")).toHaveTextContent(/2023-05-15/);

        expect(screen.getByTestId("ProfitsTable-cell-row-0-col-Health")).toHaveTextContent(/88%/);
        expect(screen.getByTestId("ProfitsTable-cell-row-1-col-Health")).toHaveTextContent(/91%/);
        expect(screen.getByTestId("ProfitsTable-cell-row-2-col-Health")).toHaveTextContent(/97%/);

        expect(screen.getByTestId("ProfitsTable-cell-row-0-col-numCows")).toHaveTextContent(/6/);
        expect(screen.getByTestId("ProfitsTable-cell-row-1-col-numCows")).toHaveTextContent(/6/);
        expect(screen.getByTestId("ProfitsTable-cell-row-2-col-numCows")).toHaveTextContent(/6/);
    });
});
