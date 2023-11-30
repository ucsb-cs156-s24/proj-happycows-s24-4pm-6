import { render, fireEvent, screen } from "@testing-library/react";
import ManageCows from "main/components/Commons/ManageCows"; 
import userCommonsFixtures from "fixtures/userCommonsFixtures";

describe("ManageCows tests", () => {
    const mockSetMessage = jest.fn();
    const mockOpenModal = jest.fn()

    test("renders without crashing", () => {
        render(
            <ManageCows userCommons = {userCommonsFixtures.oneUserCommons[0]}/>
        );
    });

    test('calls setMessage with "buy" when the buy button is clicked', () => {
        render(
            <ManageCows userCommons = {userCommonsFixtures.oneUserCommons[0]} setMessage={mockSetMessage} openModal={mockOpenModal} />
        );

        fireEvent.click(screen.getByTestId('buy-cow-button'));
        expect(mockSetMessage).toHaveBeenCalledWith('buy');
        expect(mockOpenModal).toHaveBeenCalled();
      });
    
      test('calls setMessage with "sell" when the sell button is clicked', () => {
        render(
            <ManageCows userCommons = {userCommonsFixtures.oneUserCommons[0]} setMessage={mockSetMessage} openModal={mockOpenModal}/>
        );

        fireEvent.click(screen.getByTestId('sell-cow-button'));
        expect(mockSetMessage).toHaveBeenCalledWith('sell');
        expect(mockOpenModal).toHaveBeenCalled();
      });
});