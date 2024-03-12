import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import OurTable, { ButtonColumn, DateColumn, PlaintextColumn } from "main/components/OurTable";

describe("OurTable tests", () => {
    const threeRows = [
        {
            col1: 'Hello',
            col2: 'World',
            createdAt: '2021-04-01T04:00:00.000',
            log: "foo\nbar\n  baz",
        },
        {
            col1: 'react-table',
            col2: 'rocks',
            createdAt: '2022-01-04T14:00:00.000',
            log: "foo\nbar",

        },
        {
            col1: 'whatever',
            col2: 'you want',
            createdAt: '2023-04-01T23:00:00.000',
            log: "bar\n  baz",
        }
    ];

    const tenRows = [];
    for(let i = 0; i < 10; i++) {
        tenRows.push({
            col1: `Hello ${i}`,
            col2: `World ${i}`,
            createdAt: `2021-04-01T04:00:00.000`,
            log: `foo\nbar\n  baz ${i}`,
        });
    }

    const elevenRows = [];
    for(let i = 0; i < 11; i++) {
        elevenRows.push({
            col1: `Hello ${i}`,
            col2: `World ${i}`,
            createdAt: `2021-04-01T04:00:00.000`,
            log: `foo\nbar\n  baz ${i}`,
        });
    }

    const thirtyRows = [];
    for(let i = 0; i < 30; i++) {
        thirtyRows.push({
            col1: `Hello ${i}`,
            col2: `World ${i}`,
            createdAt: `2021-04-01T04:00:00.000`,
            log: `foo\nbar\n  baz ${i}`,
        });
    }

    const hundredRows = [];
    for(let i = 0; i < 100; i++) {
        hundredRows.push({
            col1: `Hello ${i}`,
            col2: `World ${i}`,
            createdAt: `2021-04-01T04:00:00.000`,
            log: `foo\nbar\n  baz ${i}`,
        });
    }
    const clickMeCallback = jest.fn();

    const columns = [
        {
            Header: 'Column 1',
            accessor: 'col1', // accessor is the "key" in the data
        },
        {
            Header: 'Column 2',
            accessor: 'col2',
        },
        ButtonColumn("Click", "primary", clickMeCallback, "testId"),
        DateColumn("Date", (cell) => cell.row.original.createdAt),
        PlaintextColumn("Log", (cell) => cell.row.original.log),
    ];

    test("renders an empty table without crashing", () => {
        render(
            <OurTable columns={columns} data={[]} />
        );
    });

    test("renders a table with two rows without crashing", () => {
        render(
            <OurTable columns={columns} data={threeRows} />
        );
    });

    test("The button appears in the table", async () => {
        render(
            <OurTable columns={columns} data={threeRows} />
        );

        expect(await screen.findByTestId("testId-cell-row-0-col-Click-button")).toBeInTheDocument();
        const button = screen.getByTestId("testId-cell-row-0-col-Click-button");
        fireEvent.click(button);
        await waitFor(() => expect(clickMeCallback).toBeCalledTimes(1));
    });

    test("default testid is testId", async () => {
        render(
            <OurTable columns={columns} data={threeRows} />
        );
        expect(await screen.findByTestId("testid-header-col1")).toBeInTheDocument();
    });

    test("click on a header and a sort caret should appear", async () => {
        render(
            <OurTable columns={columns} data={threeRows} testid={"sampleTestId"} />
        );

        expect(await screen.findByTestId("sampleTestId-header-col1")).toBeInTheDocument();
        const col1Header = screen.getByTestId("sampleTestId-header-col1");

        const col1SortCarets = screen.getByTestId("sampleTestId-header-col1-sort-carets");
        expect(col1SortCarets).toHaveTextContent('');

        const col1Row0 = screen.getByTestId("sampleTestId-cell-row-0-col-col1");
        expect(col1Row0).toHaveTextContent("Hello");

        fireEvent.click(col1Header);
        expect(await screen.findByText("🔼")).toBeInTheDocument();

        fireEvent.click(col1Header);
        expect(await screen.findByText("🔽")).toBeInTheDocument();
    });

    test("pagination isn't visible when there is no data", async () => {
        render(
            <OurTable columns={columns} data={[]} />
        );

        var tester = true;
        try {
            await screen.findByTestId("testid-prev-page-button");
            tester = false;
        } catch(e) { }
        try {
            await screen.findByTestId("testid-next-page-button");
            tester = false;
        } catch(e) { }
        expect(tester).toBe(true);
        try {
            await screen.findByTestId("testid-current-page-button");
            tester = false;
        } catch(e) { }
        expect(tester).toBe(true);
    });

    test("renders a table with three rows without crashing", () => {
        render(
            <OurTable columns={columns} data={threeRows} />
        );
    });

    test("renders a table with 3 rows and tests that pagination isn't visible when there are less rows than rows per page", async () => {
        render(
            <OurTable columns={columns} data={threeRows} />
        );

        var tester = true;
        try {
            await screen.findByTestId("testid-prev-page-button");
            tester = false;
        } catch(e) { }
        expect(tester).toBe(true);
        try {
            await screen.findByTestId("testid-next-page-button");
            tester = false;
        } catch(e) { }
        expect(tester).toBe(true);
        try {
            await screen.findByTestId("testid-current-page-button");
            tester = false;
        } catch(e) { }
        expect(tester).toBe(true);
    });

    test("renders a table with 10 rows and tests that pagination isn't visible when there are less rows than rows per page", async () => {
        render(
            <OurTable columns={columns} data={tenRows} />
        );

        var tester = true;
        try {
            await screen.findByTestId("testid-prev-page-button");
            tester = false;
        } catch(e) { }
        expect(tester).toBe(true);
        try {
            await screen.findByTestId("testid-next-page-button");
            tester = false;
        } catch(e) { }
        expect(tester).toBe(true);
        try {
            await screen.findByTestId("testid-current-page-button");
            tester = false;
        } catch(e) { }
        expect(tester).toBe(true);
    });

    test("renders a table with 10 rows and tests that pagination is visible when there are more rows than rows per page", async () => {
        render(
            <OurTable columns={columns} data={elevenRows} />
        );

        expect(await screen.findByTestId("testid-prev-page-button")).toBeInTheDocument();
        expect(await screen.findByTestId("testid-next-page-button")).toBeInTheDocument();
        expect(await screen.findByTestId("testid-current-page-button")).toBeInTheDocument();
    });

    test("renders a table with 30 rows without crashing", () => {
        render(
            <OurTable columns={columns} data={thirtyRows} />
        );
    });

    test("renders a table with 30 rows and clicks on the next page button", async () => {
        render(
            <OurTable columns={columns} data={thirtyRows} />
        );

        expect(await screen.findByTestId("testid-next-page-button")).toBeInTheDocument();
        expect((await screen.findByTestId("testid-prev-page-button")).hasAttribute("disabled")).toBe(true);
        expect((await screen.findByTestId("testid-next-page-button")).hasAttribute("disabled")).toBe(false);
        const nextButton = screen.getByTestId("testid-next-page-button");
        for(let i = 0; i < 10; i++) {
            expect(await screen.findByText(`Hello ${i}`)).toBeInTheDocument();
        }
        var tester = true;
        for(let i = 10; i < 20; i++) {
            try {
                await screen.findByText(`Hello ${i}`);
                tester = false;
            }
            catch(e) { }
        }
        expect(tester).toBe(true);
        expect(await screen.findByTestId("testid-current-page-button")).toContainHTML("1");
        fireEvent.click(nextButton);
        expect(await screen.findByTestId("testid-current-page-button")).toContainHTML("2");
        expect((await screen.findByTestId("testid-prev-page-button")).hasAttribute("disabled")).toBe(false);
        expect((await screen.findByTestId("testid-next-page-button")).hasAttribute("disabled")).toBe(false);
        for(let i = 0; i < 10; i++) {
            try {
                await screen.findByText(`Hello ${i}`);
                tester = false;
            }
            catch(e) { }
        }
        expect(tester).toBe(true);
        for(let i = 10; i < 20; i++) {
            expect(await screen.findByText(`Hello ${i}`)).toBeInTheDocument();
        }
        fireEvent.click(nextButton);
        expect(await screen.findByTestId("testid-current-page-button")).toContainHTML("3");
        expect((await screen.findByTestId("testid-prev-page-button")).hasAttribute("disabled")).toBe(false);
        expect((await screen.findByTestId("testid-next-page-button")).hasAttribute("disabled")).toBe(true);
        for(let i = 20; i < 30; i++) {
            expect(await screen.findByText(`Hello ${i}`)).toBeInTheDocument();
        }
    }, 150000);

    test("renders a table with 100 rows and tests the first page", async () => {
        render(
            <OurTable columns={columns} data={hundredRows} />
        );
        const nextButton = screen.getByTestId("testid-next-page-button");
        fireEvent.click(nextButton);
        const prevButton = screen.getByTestId("testid-prev-page-button");
        fireEvent.click(prevButton);

        expect(await screen.findByTestId("testid-next-page-button")).toBeInTheDocument();
        var tester = true;
        try {
            await screen.findByTestId("testid-left-ellipses");
            tester = false;
        } catch(e) { }
        try {
            await screen.findByTestId("testid-back-three-page-button");
            tester = false;
        } catch(e) { }
        try {
            await screen.findByTestId("testid-back-two-page-button");
            tester = false;
        } catch(e) { }
        try {
            await screen.findByTestId("testid-back-one-page-button");
            tester = false;
        } catch(e) { }
        expect(tester).toBe(true);
        expect(await screen.findByTestId("testid-current-page-button")).toContainHTML("1");
        expect(await screen.findByTestId("testid-forward-one-page-button")).toContainHTML("2");
        expect(await screen.findByTestId("testid-forward-two-page-button")).toContainHTML("3");
        try {
            expect(await screen.findByTestId("testid-forward-three-page-button")).toBeInTheDocument();
            tester = false;
        } catch(e) { }
        expect(tester).toBe(true);
        expect(await screen.findByTestId("testid-right-ellipsis")).toBeInTheDocument();
        expect(await screen.findByTestId("testid-last-page-button")).toContainHTML("10");
        for(let i = 0; i < 10; i++) {
            expect(await screen.findByText(`Hello ${i}`)).toBeInTheDocument();
        }
    }, 10000);

    test("renders a table with 100 rows and tests the moving back one page", async () => {
        render(
            <OurTable columns={columns} data={hundredRows} />
        );

        expect(await screen.findByTestId("testid-next-page-button")).toBeInTheDocument();
        var tester = true;
        try {
            await screen.findByTestId("testid-left-ellipses");
            tester = false;
        } catch(e) { }
        try {
            await screen.findByTestId("testid-back-three-page-button");
            tester = false;
        } catch(e) { }
        try {
            await screen.findByTestId("testid-back-two-page-button");
            tester = false;
        } catch(e) { }
        try {
            await screen.findByTestId("testid-back-one-page-button");
            tester = false;
        } catch(e) { }
        expect(tester).toBe(true);
        expect(await screen.findByTestId("testid-current-page-button")).toContainHTML("1");
        expect(await screen.findByTestId("testid-forward-one-page-button")).toContainHTML("2");
        expect(await screen.findByTestId("testid-forward-two-page-button")).toContainHTML("3");
        try {
            await screen.findByTestId("testid-forward-three-page-button");
            tester = false;
        } catch(e) { }
        expect(tester).toBe(true);
        expect(await screen.findByTestId("testid-right-ellipsis")).toBeInTheDocument();
        expect(await screen.findByTestId("testid-last-page-button")).toContainHTML("10");
        for(let i = 0; i < 10; i++) {
            expect(await screen.findByText(`Hello ${i}`)).toBeInTheDocument();
        }
    }, 10000);

    test("renders a table with 100 rows and tests the last page button", async () => {
        render(
            <OurTable columns={columns} data={hundredRows} />
        );

        expect(await screen.findByTestId("testid-next-page-button")).toBeInTheDocument();
        expect((await screen.findByTestId("testid-prev-page-button")).hasAttribute("disabled")).toBe(true);
        expect((await screen.findByTestId("testid-next-page-button")).hasAttribute("disabled")).toBe(false);
        const forwardOneButton = screen.getByTestId("testid-forward-one-page-button");
        const forwardTwoButton = screen.getByTestId("testid-forward-two-page-button");
        const lastButton = screen.getByTestId("testid-last-page-button");
        const rightEllipsis = screen.getByTestId("testid-right-ellipsis");
        fireEvent.click(lastButton);
        expect(await screen.findByTestId("testid-current-page-button")).toContainHTML("10");
        for(let i = 90; i < 100; i++) {
            expect(await screen.findByText(`Hello ${i}`)).toBeInTheDocument();
        }
        expect(forwardOneButton).not.toBeInTheDocument();
        expect(forwardTwoButton).not.toBeInTheDocument();
        var tester = true;
        try {
            await screen.findByTestId("testid-forward-three-page-button");
            tester = false;
        } catch(e) { }
        expect(tester).toBe(true);
        expect(rightEllipsis).not.toBeInTheDocument();
        expect(lastButton).not.toBeInTheDocument();
        expect(await screen.findByTestId("testid-left-ellipsis")).toBeInTheDocument();
        expect(await screen.findByTestId("testid-back-two-page-button")).toContainHTML("8");
        expect(await screen.findByTestId("testid-back-one-page-button")).toContainHTML("9");
    });

    test("renders a table with 100 rows and tests the first page button", async () => {
        render(
            <OurTable columns={columns} data={hundredRows} />
        );

        expect(await screen.findByTestId("testid-next-page-button")).toBeInTheDocument();
        expect((await screen.findByTestId("testid-prev-page-button")).hasAttribute("disabled")).toBe(true);
        expect((await screen.findByTestId("testid-next-page-button")).hasAttribute("disabled")).toBe(false);
        const lastButton = screen.getByTestId("testid-last-page-button");
        fireEvent.click(lastButton);
        expect(await screen.findByTestId("testid-current-page-button")).toContainHTML("10");
        expect(await screen.findByTestId("testid-first-page-button")).toContainHTML("1");
        const firstButton = screen.getByTestId("testid-first-page-button");
        fireEvent.click(firstButton);
    });

    test("renders a table with 100 rows and tests moving forward one page", async () => {
        render(
            <OurTable columns={columns} data={hundredRows} />
        );

        expect(await screen.findByTestId("testid-forward-one-page-button")).toBeInTheDocument();
        const forwardOneButton = screen.getByTestId("testid-forward-one-page-button");
        fireEvent.click(forwardOneButton);
        expect(await screen.findByTestId("testid-current-page-button")).toContainHTML("2");
        expect(await screen.findByTestId("testid-last-page-button")).toContainHTML("10");
        const lastButton = screen.getByTestId("testid-last-page-button");
        fireEvent.click(lastButton);
        expect(await screen.findByTestId("testid-current-page-button")).toContainHTML("10");
        var tester = true;
        try {
            await screen.findByTestId("testid-forward-one-page-button");
            tester = false;
        } catch(e) { }
        expect(tester).toBe(true);
        expect(await screen.findByTestId("testid-back-one-page-button")).toContainHTML("9");
        const backOneButton = screen.getByTestId("testid-back-one-page-button");
        fireEvent.click(backOneButton);
        expect(await screen.findByTestId("testid-current-page-button")).toContainHTML("9");
        expect(await screen.findByTestId("testid-forward-one-page-button")).toContainHTML("10");
        fireEvent.click(await screen.findByTestId("testid-forward-one-page-button"));
        expect(await screen.findByTestId("testid-current-page-button")).toContainHTML("10");
    });

    test("renders a table with 100 rows and moving forward two pages", async () => {
        render(
            <OurTable columns={columns} data={hundredRows} />
        );

        expect(await screen.findByTestId("testid-forward-two-page-button")).toContainHTML("3");
        const forwardTwoButton = screen.getByTestId("testid-forward-two-page-button");
        fireEvent.click(forwardTwoButton);
        expect(await screen.findByTestId("testid-current-page-button")).toContainHTML("3");
        expect(await screen.findByTestId("testid-last-page-button")).toContainHTML("10");
        const lastButton = screen.getByTestId("testid-last-page-button");
        fireEvent.click(lastButton);
        expect(await screen.findByTestId("testid-current-page-button")).toContainHTML("10");
        var tester = true;
        try {
            await screen.findByTestId("testid-forward-two-page-button");
            tester = false;
        } catch(e) { }
        expect(tester).toBe(true);
        expect(await screen.findByTestId("testid-back-one-page-button")).toContainHTML("9");
        const backOneButton = screen.getByTestId("testid-back-one-page-button");
        fireEvent.click(backOneButton);
        expect(await screen.findByTestId("testid-current-page-button")).toContainHTML("9");
        try {
            await screen.findByTestId("testid-forward-two-page-button");
            tester = false;
        } catch(e) { }
        expect(tester).toBe(true);
        fireEvent.click(backOneButton);
        expect(await screen.findByTestId("testid-current-page-button")).toContainHTML("8");
        expect(await screen.findByTestId("testid-forward-two-page-button")).toContainHTML("10");
    });

    test("renders a table with 100 rows and moving back three pages", async () => {
        render(
            <OurTable columns={columns} data={hundredRows} />
        );

        expect(await screen.findByTestId("testid-forward-two-page-button")).toBeInTheDocument();
        const forwardThreeButton = screen.getByTestId("testid-forward-two-page-button");
        fireEvent.click(forwardThreeButton);
        expect(await screen.findByTestId("testid-current-page-button")).toContainHTML("3");
        expect(await screen.findByTestId("testid-forward-one-page-button")).toContainHTML("4");
        const forwardOneButton = screen.getByTestId("testid-forward-one-page-button");
        fireEvent.click(forwardOneButton);
        expect(await screen.findByTestId("testid-current-page-button")).toContainHTML("4");
        fireEvent.click(forwardOneButton);
        expect(await screen.findByTestId("testid-current-page-button")).toContainHTML("5");
        expect(await screen.findByTestId("testid-back-three-page-button")).toContainHTML("2");
        const backThreeButton = screen.getByTestId("testid-back-three-page-button");
        fireEvent.click(backThreeButton);
        expect(await screen.findByTestId("testid-current-page-button")).toContainHTML("2");
    });

    test("renders a table with 100 rows and tests moving back one page", async () => {
        render(
            <OurTable columns={columns} data={hundredRows} />
        );

        expect(await screen.findByTestId("testid-last-page-button")).toBeInTheDocument();
        const lastButton = screen.getByTestId("testid-last-page-button");
        fireEvent.click(lastButton);
        expect(await screen.findByTestId("testid-current-page-button")).toContainHTML("10");
        expect(await screen.findByTestId("testid-back-one-page-button")).toContainHTML("9");
        const backOneButton = screen.getByTestId("testid-back-one-page-button");
        fireEvent.click(backOneButton);
        expect(await screen.findByTestId("testid-current-page-button")).toContainHTML("9");
    });

    test("renders a table with 100 rows and tests moving back two pages", async () => {
        render(
            <OurTable columns={columns} data={hundredRows} />
        );

        expect(await screen.findByTestId("testid-last-page-button")).toBeInTheDocument();
        const lastButton = screen.getByTestId("testid-last-page-button");
        fireEvent.click(lastButton);
        expect(await screen.findByTestId("testid-current-page-button")).toContainHTML("10");
        expect(await screen.findByTestId("testid-back-two-page-button")).toContainHTML("8");
        const backTwoButton = screen.getByTestId("testid-back-two-page-button");
        fireEvent.click(backTwoButton);
        expect(await screen.findByTestId("testid-current-page-button")).toContainHTML("8");
    });

    test("renders a table with 100 rows and tests moving forward three pages", async () => {
        render(
            <OurTable columns={columns} data={hundredRows} />
        );

        expect(await screen.findByTestId("testid-last-page-button")).toBeInTheDocument();
        const lastButton = screen.getByTestId("testid-last-page-button");
        fireEvent.click(lastButton);
        expect(await screen.findByTestId("testid-current-page-button")).toContainHTML("10");
        expect(await screen.findByTestId("testid-back-two-page-button")).toContainHTML("8");
        const backTwoButton = screen.getByTestId("testid-back-two-page-button");
        fireEvent.click(backTwoButton);
        expect(await screen.findByTestId("testid-current-page-button")).toContainHTML("8");
        expect(await screen.findByTestId("testid-back-one-page-button")).toContainHTML("7");
        fireEvent.click(backTwoButton);
        expect(await screen.findByTestId("testid-current-page-button")).toContainHTML("6");
        expect(await screen.findByTestId("testid-forward-three-page-button")).toContainHTML("9");
        var tester = true;
        try {
            await screen.findByTestId("testid-right-ellipsis");
            tester = false;
        } catch(e) { }
        expect(tester).toBe(true);
        const forwardThreeButton = screen.getByTestId("testid-forward-three-page-button");
        fireEvent.click(forwardThreeButton);
        expect(await screen.findByTestId("testid-current-page-button")).toContainHTML("9");
    });

    test("renders a table with 100 rows and tests left-ellipsis", async () => {
        render(
            <OurTable columns={columns} data={hundredRows} />
        );

        expect(await screen.findByTestId("testid-last-page-button")).toBeInTheDocument();
        const lastButton = screen.getByTestId("testid-last-page-button");
        fireEvent.click(lastButton);
        expect(await screen.findByTestId("testid-current-page-button")).toContainHTML("10");
        expect(await screen.findByTestId("testid-back-two-page-button")).toContainHTML("8");
        const backTwoButton = screen.getByTestId("testid-back-two-page-button");
        fireEvent.click(backTwoButton);
        expect(await screen.findByTestId("testid-current-page-button")).toContainHTML("8");
        expect(await screen.findByTestId("testid-back-two-page-button")).toContainHTML("6");
        fireEvent.click(backTwoButton);
        expect(await screen.findByTestId("testid-current-page-button")).toContainHTML("6");
        expect(await screen.findByTestId("testid-left-ellipsis")).toBeInTheDocument();
        expect(await screen.findByTestId("testid-back-one-page-button")).toContainHTML("5");
        const backOneButton = screen.getByTestId("testid-back-one-page-button");
        fireEvent.click(backOneButton);
        expect(await screen.findByTestId("testid-current-page-button")).toContainHTML("5");
        var tester = true;
        try {
            await screen.findByTestId("testid-left-ellipsis");
            tester = false;
        } catch(e) { }
        expect(tester).toBe(true);
    });

    test("renders a table with 100 rows and tests right-ellipsis", async () => {
        render(
            <OurTable columns={columns} data={hundredRows} />
        );

        expect(await screen.findByTestId("testid-last-page-button")).toBeInTheDocument();
        const lastButton = screen.getByTestId("testid-last-page-button");
        fireEvent.click(lastButton);
        expect(await screen.findByTestId("testid-current-page-button")).toContainHTML("10");
        expect(await screen.findByTestId("testid-back-two-page-button")).toContainHTML("8");
        const backTwoButton = screen.getByTestId("testid-back-two-page-button");
        fireEvent.click(backTwoButton);
        expect(await screen.findByTestId("testid-current-page-button")).toContainHTML("8");
        expect(await screen.findByTestId("testid-back-two-page-button")).toContainHTML("6");
        fireEvent.click(backTwoButton);
        expect(await screen.findByTestId("testid-current-page-button")).toContainHTML("6");
        var tester = true;
        try {
            await screen.findByTestId("testid-right-ellipsis");
            tester = false;
        } catch(e) { }
        expect(tester).toBe(true);
        expect(await screen.findByTestId("testid-back-one-page-button")).toContainHTML("5");
        const backOneButton = screen.getByTestId("testid-back-one-page-button");
        fireEvent.click(backOneButton);
        expect(await screen.findByTestId("testid-current-page-button")).toContainHTML("5");
        expect(await screen.findByTestId("testid-right-ellipsis")).toBeInTheDocument();
    });

    test("renders a table with 100 rows and tests the first page button visibility", async () => {
        render(
            <OurTable columns={columns} data={hundredRows} />
        );

        expect(await screen.findByTestId("testid-next-page-button")).toBeInTheDocument();
        const nextButton = screen.getByTestId("testid-next-page-button");
        fireEvent.click(nextButton);
        expect(await screen.findByTestId("testid-current-page-button")).toContainHTML("2");
        var tester = true;
        try {
            await screen.findByTestId("testid-first-page-button");
            tester = false;
        } catch(e) { }
        fireEvent.click(nextButton);
        expect(await screen.findByTestId("testid-current-page-button")).toContainHTML("3");
        try {
            await screen.findByTestId("testid-first-page-button");
            tester = false;
        } catch(e) { }
        fireEvent.click(nextButton);
        expect(await screen.findByTestId("testid-current-page-button")).toContainHTML("4");
        try {
            await screen.findByTestId("testid-first-page-button");
            tester = false;
        } catch(e) { }
        expect(tester).toBe(true);
        fireEvent.click(nextButton);
        expect(await screen.findByTestId("testid-current-page-button")).toContainHTML("5");
        expect(await screen.findByTestId("testid-first-page-button")).toBeInTheDocument();
        const firstButton = screen.getByTestId("testid-first-page-button");
        fireEvent.click(firstButton);
        expect(await screen.findByTestId("testid-current-page-button")).toContainHTML("1");
    });

    test("renders a table with 100 rows and tests the back two page button", async () => {
        render(
            <OurTable columns={columns} data={hundredRows} />
        );

        expect(await screen.findByTestId("testid-next-page-button")).toBeInTheDocument();
        const nextButton = screen.getByTestId("testid-next-page-button");
        fireEvent.click(nextButton);
        expect(await screen.findByTestId("testid-current-page-button")).toContainHTML("2");
        var tester = true;
        try {
            await screen.findByTestId("testid-back-two-page-button");
            tester = false;
        } catch(e) { }
        expect(tester).toBe(true);
        fireEvent.click(nextButton);
        expect(await screen.findByTestId("testid-current-page-button")).toContainHTML("3");
        expect(await screen.findByTestId("testid-back-two-page-button")).toBeInTheDocument();
    });

    test("renders a table with 100 rows and tests the last page button visibiliy", async () => {
        render(
            <OurTable columns={columns} data={hundredRows} />
        );

        expect(await screen.findByTestId("testid-last-page-button")).toContainHTML("10");
        const lastButton = screen.getByTestId("testid-last-page-button");
        fireEvent.click(lastButton);
        expect(await screen.findByTestId("testid-current-page-button")).toContainHTML("10");
        expect(await screen.findByTestId("testid-back-one-page-button")).toContainHTML("9");
        const backOneButton = screen.getByTestId("testid-back-one-page-button");
        fireEvent.click(backOneButton);
        expect(await screen.findByTestId("testid-current-page-button")).toContainHTML("9");
        expect(await screen.findByTestId("testid-forward-one-page-button")).toContainHTML("10");
        expect(lastButton).not.toBeInTheDocument();
        fireEvent.click(backOneButton);
        expect(await screen.findByTestId("testid-current-page-button")).toContainHTML("8");
        expect(lastButton).not.toBeInTheDocument();
        fireEvent.click(backOneButton);
        expect(await screen.findByTestId("testid-current-page-button")).toContainHTML("7");
        expect(lastButton).not.toBeInTheDocument();
    });
});
