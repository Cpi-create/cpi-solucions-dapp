import React, { useState, useEffect } from "react";
import { connectWallet, getTokenBalance, getTotalSupply } from "./web3";

function App() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("Cargando...");
  const [totalSupply, setTotalSupply] = useState("Cargando...");

  const handleConnectWallet = async () => {
    const connectedAccount = await connectWallet();
    setAccount(connectedAccount);

    if (connectedAccount) {
      const userBalance = await getTokenBalance(connectedAccount);
      const supply = await getTotalSupply();

      setBalance(`${userBalance} CPI`);
      setTotalSupply(`${supply} CPI`);
    }
  };

  useEffect(() => {
    handleConnectWallet();
  }, []);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center", padding: "20px" }}>
      <h1 style={{ color: "#2c3e50" }}>CPI Solution</h1>
      <p>Tu portal para interactuar con contratos inteligentes de blockchain.</p>
      <div style={{ margin: "0 auto", maxWidth: "400px", border: "1px solid #ccc", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
        <p>
          <strong>Cuenta conectada:</strong> {account ? account : "Conectando..."}
        </p>
        <p>
          <strong>Balance de tokens:</strong> {balance}
        </p>
        <p>
          <strong>Suministro total:</strong> {totalSupply}
        </p>
      </div>
    </div>
  );
}

export default App;
