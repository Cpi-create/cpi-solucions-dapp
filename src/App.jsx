import React, { useState, useEffect } from "react";
import { createToken, getCreatedTokens } from "./web3.jsx";

function App() {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [admin, setAdmin] = useState("");
  const [usdcToken, setUsdcToken] = useState("");
  const [initialSupply, setInitialSupply] = useState("");
  const [message, setMessage] = useState("");
  const [tokens, setTokens] = useState([]);
  const [account, setAccount] = useState(null); // Estado para la cuenta conectada

  // Obtener la lista de tokens creados al cargar la página
  useEffect(() => {
    async function fetchTokens() {
      const createdTokens = await getCreatedTokens();
      setTokens(createdTokens);
    }
    fetchTokens();
  }, []);

  // Función para conectar MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        setMessage(`Conectado con la cuenta: ${accounts[0]}`);
      } catch (error) {
        console.error("Error al conectar MetaMask:", error);
        setMessage("Error al conectar MetaMask.");
      }
    } else {
      alert("MetaMask no está instalado. Por favor, instálalo para usar la DApp.");
    }
  };

  const handleCreateToken = async () => {
    if (!account) {
      setMessage("Conecta MetaMask antes de crear un token.");
      return;
    }

    try {
      setMessage("Creando token...");
      const txHash = await createToken(name, symbol, admin, usdcToken, initialSupply);
      setMessage(`¡Token creado con éxito! Hash de la transacción: ${txHash}`);
      const updatedTokens = await getCreatedTokens(); // Actualizar lista de tokens creados
      setTokens(updatedTokens);
    } catch (error) {
      console.error("Error al crear el token:", error);
      setMessage("Error al crear el token. Revisa la consola para más detalles.");
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center", padding: "2rem" }}>
      <h1>Solución CPI</h1>
      <button onClick={connectWallet} style={{ marginBottom: "1rem", padding: "0.5rem 1rem" }}>
        {account ? `Conectado: ${account}` : "Conectar MetaMask"}
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
        <label>Dirección del administrador:</label>
        <input type="text" value={admin} onChange={(e) => setAdmin(e.target.value)} />
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <label>Dirección del contrato USDC:</label>
        <input type="text" value={usdcToken} onChange={(e) => setUsdcToken(e.target.value)} />
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <label>Cantidad inicial de tokens:</label>
        <input type="number" value={initialSupply} onChange={(e) => setInitialSupply(e.target.value)} />
      </div>
      <button onClick={handleCreateToken} style={{ padding: "0.5rem 1rem" }}>
        Crear Token
      </button>
      <p>{message}</p>
      <h2>Tokens creados</h2>
      <ul>
        {tokens.map((token, index) => (
          <li key={index}>{token}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
