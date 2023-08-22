import { render, screen } from "@testing-library/react";
import Footer from "main/components/Nav/Footer";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

describe("Footer tests", () => {
    test("renders correctly", async () => {
        render(
            <Footer systemInfo={systemInfoFixtures.showingAll}/>
        );

        const text = screen.getByTestId("footer-content");
        expect(text).toBeInTheDocument();
        expect(typeof(text.textContent)).toBe('string');
        expect(text.textContent).toEqual('HappyCows is a project of Mattanjah de Vries, Distinguished Professor of Chemistry at UC Santa Barbara. The open source code is available on GitHub.');
    
        const href = screen.getByTestId("github-href");
        expect(href).toHaveAttribute("href", "https://github.com/ucsb-cs156/proj-happycows");
    });

    test("renders correctly when systemInfo.showingNeither", async () => {
        render(
            <Footer/>
        );

        const text = screen.getByTestId("footer-content");
        expect(text).toBeInTheDocument();
            
        const href = screen.getByTestId("github-href");
        expect(href.href).toBe("");
    });
});
