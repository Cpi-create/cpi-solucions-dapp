import React, { useState } from 'react';
import connectBlockchain from './web3';

const App = () => {
  const [address, setAddress] = useState('');

  const connectWallet = async () => {
    try {
      const { signer } = await connectBlockchain();
      if (signer) {
        const userAddress = await signer.getAddress();
        setAddress(userAddress);
      }
    } catch (error) {
      console.error('Error al conectar la wallet:', error);
    }
  };

  return (
    <div>
      <h1>¡Bienvenido a CPI Financial DApp!</h1>
      {address ? (
        <p>Wallet conectada: {address}</p>
      ) : (
        <button onClick={connectWallet}>Conectar Wallet</button>
      )}
    </div>
  );
};

export default App;
