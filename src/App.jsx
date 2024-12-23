import React, { useState } from "react";
import { createToken } from "./web3.jsx";

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
      setMessage("MetaMask no está instalada. Por favor, instálala para usar esta DApp.");
    }
  };

  const handleCreateToken = async () => {
    if (!walletAddress) {
      setMessage("Conecta tu wallet antes de crear un token.");
      return;
    }
    try {
      setMessage("Creando token...");
      const usdcContractAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"; // Reemplaza con la dirección real del contrato USDC
      const txHash = await createToken(name, symbol, walletAddress, usdcContractAddress, initialSupply);
      setMessage(`¡Token creado con éxito! Hash de la transacción: ${txHash}`);
    } catch (error) {
      console.error("Error al crear el token:", error);
      setMessage("Error al crear el token. Verifica los datos y vuelve a intentarlo.");
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
