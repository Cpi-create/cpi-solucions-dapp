import React, { useState } from "react";
import { connectWallet, getTokenBalance, getTotalSupply } from "./web3";

function App() {
  const [connectedAccount, setConnectedAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [totalSupply, setTotalSupply] = useState(null);

  const handleConnectWallet = async () => {
    const account = await connectWallet();
    setConnectedAccount(account);

    if (account) {
      const rawBalance = await getTokenBalance(account);
      const readableBalance = rawBalance / 10 ** 18; // Suponiendo 18 decimales
      setBalance(readableBalance);

      const rawTotalSupply = await getTotalSupply();
      const readableTotalSupply = rawTotalSupply / 10 ** 18; // Suponiendo 18 decimales
      setTotalSupply(readableTotalSupply);
    }
  };

  return (
    <div>
      <h1>¡Hola, Mundo!</h1>
      <p>Conecta tu wallet para interactuar con el contrato.</p>
      {connectedAccount ? (
        <>
          <p>
            <strong>Cuenta conectada:</strong> {connectedAccount}
          </p>
          <p>
            <strong>Balance de tokens:</strong> {balance || "Cargando..."} CPI
          </p>
          <p>
            <strong>Suministro total:</strong> {totalSupply || "Cargando..."} CPI
          </p>
        </>
      ) : (
        <button onClick={handleConnectWallet}>Conectar Wallet</button>
      )}
    </div>
  );
}

export default App;
