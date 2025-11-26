import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OnRamp from '../OnRamp';

// Mock the sub-components to isolate the test to the OnRamp logic
jest.mock('../BuyEthStep', () => ({ onComplete }) => (
  <div>
    <h2>Passo 1: Comprar ETH</h2>
    <button onClick={onComplete}>Complete Buy ETH</button>
  </div>
));

jest.mock('../SwapNationStep', () => ({ onComplete }) => (
  <div>
    <h2>Passo 2: Trocar ETH por $NATION</h2>
    <button onClick={onComplete}>Complete Swap</button>
  </div>
));

jest.mock('../BuyNftStep', () => ({ onComplete }) => (
  <div>
    <h2>Passo 3: Comprar o Nation Pass NFT</h2>
    <button onClick={onComplete}>Complete Buy NFT</button>
  </div>
));

describe('OnRamp Component', () => {
  it('should render the first step (Buy ETH) initially', () => {
    render(<OnRamp />);
    expect(screen.getByText('Passo 1: Comprar ETH')).toBeInTheDocument();
  });

  it('should progress to the second step (Swap Nation) when the first is completed', () => {
    render(<OnRamp />);
    fireEvent.click(screen.getByText('Complete Buy ETH'));
    expect(screen.getByText('Passo 2: Trocar ETH por $NATION')).toBeInTheDocument();
  });

  it('should progress to the third step (Buy NFT) when the second is completed', () => {
    render(<OnRamp />);
    fireEvent.click(screen.getByText('Complete Buy ETH'));
    fireEvent.click(screen.getByText('Complete Swap'));
    expect(screen.getByText('Passo 3: Comprar o Nation Pass NFT')).toBeInTheDocument();
  });

  it('should show the completed message when the third step is completed', () => {
    render(<OnRamp />);
    fireEvent.click(screen.getByText('Complete Buy ETH'));
    fireEvent.click(screen.getByText('Complete Swap'));
    fireEvent.click(screen.getByText('Complete Buy NFT'));
    expect(screen.getByText('Parabéns!')).toBeInTheDocument();
  });
});
