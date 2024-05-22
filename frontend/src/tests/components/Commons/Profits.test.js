import { render, screen, waitFor } from "@testing-library/react";
import Profits from "main/components/Commons/Profits"; 
import userCommonsFixtures from "fixtures/userCommonsFixtures"; 

import { QueryClient, QueryClientProvider } from "react-query";

describe("Profits tests", () => {
    
    test("renders properly when profits is not given", async () => {
        const queryClient = new QueryClient();
        render(
        <QueryClientProvider client={queryClient}>
                <Profits userCommons={userCommonsFixtures.oneUserCommons[0]}  />
        </QueryClientProvider>
            
        );
        await waitFor(()=>{
            expect(screen.getByTestId("PagedProfitsTable-header-amount") ).toBeInTheDocument();
        });
    });

    
});
