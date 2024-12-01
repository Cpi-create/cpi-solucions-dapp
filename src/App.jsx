import React, { useEffect, useState } from "react";
import { connectWallet, getTokenBalance, getTotalSupply } from "./web3";

function App() {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState(null);
  const [totalSupply, setTotalSupply] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const connectedAccount = await connectWallet();
      setAccount(connectedAccount);

      if (connectedAccount) {
        const balance = await getTokenBalance(connectedAccount);
        const supply = await getTotalSupply();
        setBalance(balance / 1e18); // Convertimos de wei a formato decimal
        setTotalSupply(supply / 1e18); // Convertimos de wei a formato decimal
      }
    }
    fetchData();
  }, []);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center", padding: "2rem" }}>
      <h1 style={{ color: "#333" }}>Solución CPI</h1>
      <p style={{ fontSize: "1.2rem", color: "#666" }}>
        Tu portal para interactuar con contratos inteligentes de blockchain.
      </p>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "1.5rem",
          margin: "2rem auto",
          maxWidth: "400px",
          background: "#f9f9f9",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <p>
          <strong>Cuenta conectada:</strong> {account}
        </p>
        <p>
          <strong>Balance de tokens:</strong> {balance !== null ? `${balance} CPI` : "Cargando..."}
        </p>
        <p>
          <strong>Suministro total:</strong> {totalSupply !== null ? `${totalSupply} CPI` : "Cargando..."}
        </p>
      </div>
    </div>
  );
}

export default App;
