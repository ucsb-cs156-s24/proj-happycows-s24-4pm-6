import { render, screen, waitFor } from "@testing-library/react";
import ProfitsTable from "main/components/Commons/ProfitsTable";
import profitsFixtures from "fixtures/profitsFixtures";

describe("ProfitsTable tests", () => {
    test("renders without crashing for 0 profits", () => {
        render(
            <ProfitsTable profits={[]} />
        );
    });

    test("renders without crashing", async () => {
        render(
            <ProfitsTable profits={profitsFixtures.threeProfits} />
        );
        await waitFor(()=>{
            expect(screen.getByTestId("ProfitsTable-header-Profit") ).toBeInTheDocument();
        });

        const expectedHeaders = [ "Profit", "Date", "Health", "Cows"];
    
        expectedHeaders.forEach((headerText) => {
          const header = screen.getByText(headerText);
          expect(header).toBeInTheDocument();
        });

    });
});