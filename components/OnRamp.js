import React, { useState } from 'react';
import BuyEthStep from './BuyEthStep';
import SwapNationStep from './SwapNationStep';
import BuyNftStep from './BuyNftStep';

// Define os passos da jornada on-ramp
const STEPS = {
  BUY_ETH: 'BUY_ETH',
  SWAP_NATION: 'SWAP_NATION',
  BUY_NFT: 'BUY_NFT',
  COMPLETED: 'COMPLETED',
};

const OnRamp = () => {
  const [currentStep, setCurrentStep] = useState(STEPS.BUY_ETH);

  const goToNextStep = () => {
    switch (currentStep) {
      case STEPS.BUY_ETH:
        setCurrentStep(STEPS.SWAP_NATION);
        break;
      case STEPS.SWAP_NATION:
        setCurrentStep(STEPS.BUY_NFT);
        break;
      case STEPS.BUY_NFT:
        setCurrentStep(STEPS.COMPLETED);
        break;
      default:
        break;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case STEPS.BUY_ETH:
        return <BuyEthStep onComplete={goToNextStep} />;
      case STEPS.SWAP_NATION:
        return <SwapNationStep onComplete={goToNextStep} />;
      case STEPS.BUY_NFT:
        return <BuyNftStep onComplete={goToNextStep} />;
      case STEPS.COMPLETED:
        return (
          <div>
            <h2>Parabéns!</h2>
            <p>Você completou a jornada e está pronto para criar seu agente.</p>
          </div>
        );
      default:
        return <div>Carregando passo...</div>;
    }
  };

  return (
    <div className="onramp-container">
      <h1>Crie seu Agente</h1>
      <p>Siga os passos abaixo para adquirir os recursos necessários.</p>
      <div className="step-content">
        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default OnRamp;
