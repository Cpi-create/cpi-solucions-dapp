import React, { useState, useEffect } from "react";
import { createToken, getCreatedTokens } from "./web3.jsx";

function App() {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [initialSupply, setInitialSupply] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [message, setMessage] = useState("");

  // Función para conectar MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        setMessage("¡Wallet conectada exitosamente!");
      } catch (error) {
        console.error("Error al conectar MetaMask:", error);
        setMessage("Error al conectar MetaMask.");
      }
    } else {
      setMessage("MetaMask no está instalada.");
    }
  };

  const handleCreateToken = async () => {
    try {
      setMessage("Creando token...");
      const txHash = await createToken(name, symbol, walletAddress, "<USDC_CONTRACT_ADDRESS>", initialSupply);
      setMessage(`¡Token creado con éxito! Hash de la transacción: ${txHash}`);
    } catch (error) {
      console.error("Error al crear el token:", error);
      setMessage("Error al crear el token.");
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center", padding: "2rem" }}>
      <h1>¡Bienvenido a CPI Financial DApp!</h1>
      <button onClick={connectWallet} style={{ marginBottom: "1rem", padding: "0.5rem 1rem" }}>
        {walletAddress ? `Wallet Conectada: ${walletAddress}` : "Conectar Wallet"}
      </button>
      <h2>Crear un nuevo token</h2>
      <div style={{ marginBottom: "1rem" }}>
        <label>Nombre del token:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <label>Símbolo del token:</label>
        <input type="text" value={symbol} onChange={(e) => setSymbol(e.target.value)} />
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <label>Suministro inicial:</label>
        <input type="number" value={initialSupply} onChange={(e) => setInitialSupply(e.target.value)} />
      </div>
      <button onClick={handleCreateToken} style={{ padding: "0.5rem 1rem" }}>
        Crear Token
      </button>
      <p>{message}</p>
    </div>
  );
}

export default App;
