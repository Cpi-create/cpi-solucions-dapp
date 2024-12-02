import React, { useState } from "react";
import { connectWallet, createToken, getCreatedTokens } from "./web3";

function App() {
  const [account, setAccount] = useState("");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [admin, setAdmin] = useState("");
  const [usdcAddress, setUsdcAddress] = useState("");
  const [createdTokens, setCreatedTokens] = useState([]);

  // Conectar la wallet
  const handleConnectWallet = async () => {
    const connectedAccount = await connectWallet();
    setAccount(connectedAccount);
  };

  // Crear un nuevo token
  const handleCreateToken = async (e) => {
    e.preventDefault();
    const txHash = await createToken(name, symbol, admin, usdcAddress);
    if (txHash) {
      alert(`¡Token creado exitosamente! Hash de la transacción: ${txHash}`);
      fetchCreatedTokens(); // Actualiza la lista de tokens creados
    }
  };

  // Obtener la lista de tokens creados
  const fetchCreatedTokens = async () => {
    const tokens = await getCreatedTokens();
    setCreatedTokens(tokens);
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center", padding: "2rem" }}>
      <h1 style={{ color: "#333" }}>Solución CPI</h1>
      <p style={{ fontSize: "1.2rem", color: "#666" }}>
        Tu portal para interactuar con contratos inteligentes de blockchain.
      </p>

      <div style={{ marginBottom: "1rem" }}>
        {account ? (
          <p><strong>Cuenta conectada:</strong> {account}</p>
        ) : (
          <button onClick={handleConnectWallet} style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
            Conectar Wallet
          </button>
        )}
      </div>

      <h2>Crear un nuevo token</h2>
      <form onSubmit={handleCreateToken} style={{ maxWidth: "400px", margin: "0 auto", textAlign: "left" }}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Nombre del token:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: "0.5rem" }}
            required
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Símbolo del token:</label>
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            style={{ width: "100%", padding: "0.5rem" }}
            required
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Dirección del administrador:</label>
          <input
            type="text"
            value={admin}
            onChange={(e) => setAdmin(e.target.value)}
            style={{ width: "100%", padding: "0.5rem" }}
            required
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Dirección del contrato USDC:</label>
          <input
            type="text"
            value={usdcAddress}
            onChange={(e) => setUsdcAddress(e.target.value)}
            style={{ width: "100%", padding: "0.5rem" }}
            required
          />
        </div>
        <button type="submit" style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
          Crear Token
        </button>
      </form>

      <h2>Tokens creados</h2>
      <ul style={{ listStyleType: "none", padding: "0" }}>
        {createdTokens.map((token, index) => (
          <li key={index} style={{ marginBottom: "0.5rem" }}>
            {token}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
