import React, { useState } from "react";
import { connectWallet, getTokenBalance, getTotalSupply } from "./web3";

function App() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [totalSupply, setTotalSupply] = useState(null);

  // Conectar MetaMask
  const handleConnectWallet = async () => {
    const connectedAccount = await connectWallet();
    if (connectedAccount) {
      setAccount(connectedAccount);
      fetchBalance(connectedAccount);
      fetchTotalSupply();
    }
  };

  // Obtener balance del usuario
  const fetchBalance = async (account) => {
    const userBalance = await getTokenBalance(account);
    setBalance(userBalance.toString());
  };

  // Obtener suministro total
  const fetchTotalSupply = async () => {
    const supply = await getTotalSupply();
    setTotalSupply(supply.toString());
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>¡Hola, Mundo!</h1>
      <p>Conecta tu wallet para interactuar con el contrato.</p>

      {!account ? (
        <button
          onClick={handleConnectWallet}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Conectar Wallet
        </button>
      ) : (
        <div>
          <p>
            <strong>Cuenta conectada:</strong> {account}
          </p>
          <p>
            <strong>Balance de tokens:</strong>{" "}
            {balance !== null ? `${balance} CPI` : "Cargando..."}
          </p>
          <p>
            <strong>Suministro total:</strong>{" "}
            {totalSupply !== null ? `${totalSupply} CPI` : "Cargando..."}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
