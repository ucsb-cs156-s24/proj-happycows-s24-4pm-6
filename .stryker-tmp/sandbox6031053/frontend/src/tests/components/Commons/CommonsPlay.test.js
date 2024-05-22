import { render, screen, waitFor } from "@testing-library/react";
import CommonsPlay from "main/components/Commons/CommonsPlay"; 
import commonsFixtures from "fixtures/commonsFixtures"; 
import { currentUserFixtures } from "fixtures/currentUserFixtures";

describe("CommonsPlay tests", () => {
    test("renders without crashing when user is userOnly", () => {
        render(
            <CommonsPlay currentUser={currentUserFixtures.userOnly } commons={commonsFixtures.oneCommons[0]} />
        );
    });

    test("renders without crashing when user is admin", () => {
        render(
            <CommonsPlay currentUser={currentUserFixtures.adminUser } commons={commonsFixtures.oneCommons[0]} />
        );
    });

    test("renders without crashing when currentUser.root is undefined", async () => {
        render(
            <CommonsPlay currentUser={currentUserFixtures.noRoot } commons={commonsFixtures.oneCommons[0]} />
        );

        await waitFor(()=>{
            expect(screen.getByTestId("CommonsPlay")).toBeInTheDocument();
        });

    });
    test("Commons Play has the correct styles applied", async () => {
        render(
            <CommonsPlay currentUser={currentUserFixtures.noRoot } commons={commonsFixtures.oneCommons[0]} />
        );

        await waitFor(()=>{
            expect(screen.getByTestId("commons-card")).toBeInTheDocument();
        });
    
        const CommonsCard = screen.getByTestId("commons-card");
        expect(CommonsCard).toHaveStyle('opacity: .9;');       

    });
});
