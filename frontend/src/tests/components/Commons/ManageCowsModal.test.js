import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ManageCowsModal from 'main/components/Commons/ManageCowsModal';
import userCommonsFixtures from "fixtures/userCommonsFixtures";

describe('ManageCowsModal', () => {
  const mockOnClose = jest.fn();
  const mockSetNumber = jest.fn();
  const mockOnBuy = jest.fn();
  const mockOnSell = jest.fn();

  test('renders the modal when isOpen is true', () => {
    render(
        <ManageCowsModal isOpen={true} onClose={mockOnClose} message="buy" setNumber={mockSetNumber} />
    );

    expect(screen.getByTestId('buy-sell-cow-modal')).toBeInTheDocument();
  });

  test('does not render the modal when isOpen is false', () => {
    render(
        <ManageCowsModal isOpen={false} onClose={mockOnClose} message="buy" setNumber={mockSetNumber} />
    );

    expect(screen.queryByTestId('buy-sell-cow-modal')).not.toBeInTheDocument();
  });

  test('calls onClose and setNumber when close button is clicked', () => {
    render(
        <ManageCowsModal isOpen={true} onClose={mockOnClose} message="buy" setNumber={mockSetNumber} />
    );


    fireEvent.click(screen.getByTestId('buy-sell-cow-modal-close'));
    expect(mockOnClose).toHaveBeenCalled();
    expect(mockSetNumber).toHaveBeenCalledWith(1);
  });

  test('calls onClose and setNumber when cancel button is clicked', () => {
    render(
        <ManageCowsModal isOpen={true} onClose={mockOnClose} message="buy" setNumber={mockSetNumber} />
    );


    fireEvent.click(screen.getByTestId('buy-sell-cow-modal-cancel'));
    expect(mockOnClose).toHaveBeenCalled();
    expect(mockSetNumber).toHaveBeenCalledWith(1);
  });

  test('calls onBuy with correct arguments when buy button is clicked', async () => {
    const number = 5;
    render(
        <ManageCowsModal isOpen={true} onClose={mockOnClose} message="buy" userCommons={userCommonsFixtures.oneUserCommons[0]} number={number} onBuy={mockOnBuy} setNumber={mockSetNumber} />
    );

    fireEvent.click(screen.getByTestId('buy-sell-cow-modal-submit'));

    await waitFor(()=>expect(mockOnBuy).toHaveBeenCalledWith(userCommonsFixtures.oneUserCommons[0], number));
  });

  test('calls onSell with correct arguments when sell button is clicked', async () => {
    const number2 = 3;
    render(
        <ManageCowsModal isOpen={true} onClose={mockOnClose} message="sell" userCommons={userCommonsFixtures.oneUserCommons[0]} number={number2} onSell={mockOnSell} setNumber={mockSetNumber} />
    );

    fireEvent.click(screen.getByTestId('buy-sell-cow-modal-submit'));

    await waitFor(()=>expect(mockOnSell).toHaveBeenCalledWith(userCommonsFixtures.oneUserCommons[0], number2));
  });

  test('updates the number state on input change', () => {
    render(
        <ManageCowsModal isOpen={true} onClose={mockOnClose} message="buy" setNumber={mockSetNumber} />
    );

    const input = screen.getByTestId('buy-sell-cow-modal-input');

    fireEvent.change(input, { target: { value: '10' } });
    expect(mockSetNumber).toHaveBeenCalledWith('10');
  });

  test('Check styling of modal components', () => {
    render(
        <ManageCowsModal isOpen={true} onClose={mockOnClose} message="buy" setNumber={mockSetNumber} />
    );

    expect(screen.getByTestId("buy-sell-cow-modal-footer")).toHaveStyle("border-top: 0px");
    expect(screen.getByTestId("buy-sell-cow-modal-input")).toHaveStyle("width: 20%");
    expect(screen.getByTestId("buy-sell-cow-modal-close")).toHaveStyle("color: rgb(0, 0, 0); border-color: #fff; background-color: rgb(255, 255, 255);");
    expect(screen.getByTestId("buy-sell-cow-modal-closeGroup")).toHaveStyle("display: flex; justify-content: right");
    
  })
});