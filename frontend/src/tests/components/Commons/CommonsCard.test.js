import { fireEvent, render, screen } from "@testing-library/react";
import '@testing-library/jest-dom'
import CommonsCard from "main/components/Commons/CommonsCard";
import commonsFixtures from "fixtures/commonsFixtures";

const curr = new Date();

describe("CommonsCard tests", () => {
    test("renders without crashing when button text is set", async () => {
        const click = jest.fn();
        render(
            <CommonsCard commons={commonsFixtures.threeCommons[0]} buttonText={"Join"} buttonLink={click} />
        );

        const button = screen.getByTestId("commonsCard-button-Join-5");
        expect(button).toBeInTheDocument();
        expect(typeof (button.textContent)).toBe('string');
        expect(button.textContent).toEqual('Join');
        fireEvent.click(button);
        expect(click).toBeCalledTimes(1);

        const name = screen.getByTestId("commonsCard-name-5");
        expect(name).toBeInTheDocument();
        expect(typeof (name.textContent)).toBe('string');
        expect(name.textContent).toEqual('Seths Common');

        const id = screen.getByTestId("commonsCard-id-5");
        expect(id).toBeInTheDocument();
        expect(typeof (id.textContent)).toBe('string');
        expect(id.textContent).toEqual('5');
    });

    test("renders no button when button text is null", () => {
        render(
            <CommonsCard commons={commonsFixtures.threeCommons[0]} buttonText={null} />
        );

        expect(() => screen.getByTestId("commonsCard-button-Join-5")).toThrow('Unable to find an element');

        const name = screen.getByTestId("commonsCard-name-5");
        expect(name).toBeInTheDocument();
        expect(typeof (name.textContent)).toBe('string');
        expect(name.textContent).toEqual('Seths Common');

        const id = screen.getByTestId("commonsCard-id-5");
        expect(id).toBeInTheDocument();
        expect(typeof (id.textContent)).toBe('string');
        expect(id.textContent).toEqual('5');
    });

    test("cannot join commons with future start date - future year", async () => {
        const futureYearCommon = commonsFixtures.threeCommons[2];
        futureYearCommon.startingDate = new Date(curr.getFullYear() + 1, curr.getMonth(), curr.getDate()).toISOString().substring(0, 10);
        const click = jest.fn();
        window.alert = jest.fn();
        render(
            <CommonsCard commons={futureYearCommon} buttonText={"Join"} buttonLink={click} />
        );

        const button = screen.getByTestId("commonsCard-button-Join-1");
        expect(button).toBeInTheDocument();
        expect(typeof (button.textContent)).toBe('string');
        expect(button.textContent).toEqual('Join');
        fireEvent.click(button);
        expect(click).toBeCalledTimes(0);
        // const alertElement = getByRole('alert');
        expect(window.alert).toHaveBeenCalledTimes(1);
        // expect(alertElement).toHaveTextContent("This commons has not started yet and cannot be joined.\n The starting date is "
        // + parseInt(futureYearCommon.startingDate.substring(5,7)) + "/" 
        // + parseInt(futureYearCommon.startingDate.substring(8,10)) + "/" 
        // + parseInt(futureYearCommon.startingDate));

        expect(button).toBeInTheDocument();
        expect(typeof (button.textContent)).toBe('string');
        expect(button.textContent).toEqual('Join');
    });

    test("cannot join commons with future start date - future month", async () => {
        const futureCommon = commonsFixtures.threeCommons[2];
        futureCommon.startingDate = new Date(curr.getFullYear(), curr.getMonth() + 2, curr.getDate()).toISOString().substring(0, 10);
        const click = jest.fn();
        render(
            <CommonsCard commons={futureCommon} buttonText={"Join"} buttonLink={click} />
        );

        const button = screen.getByTestId("commonsCard-button-Join-1");
        expect(button).toBeInTheDocument();
        expect(typeof (button.textContent)).toBe('string');
        expect(button.textContent).toEqual('Join');
        fireEvent.click(button);
        expect(click).toBeCalledTimes(0);

        expect(button).toBeInTheDocument();
        expect(typeof (button.textContent)).toBe('string');
        expect(button.textContent).toEqual('Join');
    });

    test("can join commons with past date - past month", async () => {
        const futureCommon = commonsFixtures.threeCommons[2];
        futureCommon.startingDate = new Date(curr.getFullYear(), curr.getMonth() - 1, curr.getDate()).toISOString().substring(0, 10);
        const click = jest.fn();
        render(
            <CommonsCard commons={futureCommon} buttonText={"Join"} buttonLink={click} />
        );

        const button = screen.getByTestId("commonsCard-button-Join-1");
        expect(button).toBeInTheDocument();
        expect(typeof (button.textContent)).toBe('string');
        expect(button.textContent).toEqual('Join');
        fireEvent.click(button);
        expect(click).toBeCalledTimes(1);
    });

    test("cannot join commons with future start date - future day", async () => {
        const futureCommon = commonsFixtures.threeCommons[2];
        futureCommon.startingDate = new Date(curr.getFullYear(), curr.getMonth(), curr.getDate() + 1).toISOString().substring(0, 10);
        const click = jest.fn();
        render(
            <CommonsCard commons={futureCommon} buttonText={"Join"} buttonLink={click} />
        );

        const button = screen.getByTestId("commonsCard-button-Join-1");
        expect(button).toBeInTheDocument();
        expect(typeof (button.textContent)).toBe('string');
        expect(button.textContent).toEqual('Join');
        fireEvent.click(button);
        expect(click).toBeCalledTimes(0);

        expect(button).toBeInTheDocument();
        expect(typeof (button.textContent)).toBe('string');
        expect(button.textContent).toEqual('Join');
    });

    test("can join commons with current date", async () => {
        const futureCommon = commonsFixtures.threeCommons[2];
        futureCommon.startingDate = new Date(curr.getFullYear(), curr.getMonth(), curr.getDate()).toISOString().substring(0, 10);
        const click = jest.fn();
        render(
            <CommonsCard commons={futureCommon} buttonText={"Join"} buttonLink={click} />
        );

        const button = screen.getByTestId("commonsCard-button-Join-1");
        expect(button).toBeInTheDocument();
        expect(typeof (button.textContent)).toBe('string');
        expect(button.textContent).toEqual('Join');
        fireEvent.click(button);
        expect(click).toBeCalledTimes(1);
    });

    test("can join commons with past start date", async () => {
        const click = jest.fn();
        render(
            <CommonsCard commons={commonsFixtures.threeCommons[0]} buttonText={"Join"} buttonLink={click} />
        );

        const button = screen.getByTestId("commonsCard-button-Join-5");
        expect(button).toBeInTheDocument();
        expect(typeof (button.textContent)).toBe('string');
        expect(button.textContent).toEqual('Join');
        fireEvent.click(button);
        expect(click).toBeCalledTimes(1);
    });
});