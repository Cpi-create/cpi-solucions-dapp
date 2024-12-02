import React, { useState, useEffect } from "react";
import { createToken, getCreatedTokens } from "./web3";

function App() {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [admin, setAdmin] = useState("");
  const [usdcToken, setUsdcToken] = useState("");
  const [initialSupply, setInitialSupply] = useState("");
  const [message, setMessage] = useState("");
  const [tokens, setTokens] = useState([]);

  // Obtener la lista de tokens creados al cargar la página
  useEffect(() => {
    async function fetchTokens() {
      const createdTokens = await getCreatedTokens();
      setTokens(createdTokens);
    }
    fetchTokens();
  }, []);

  const handleCreateToken = async () => {
    try {
      setMessage("Creando token...");
      const txHash = await createToken(name, symbol, admin, usdcToken, initialSupply);
      setMessage(`¡Token creado con éxito! Hash de la transacción: ${txHash}`);
      const updatedTokens = await getCreatedTokens(); // Actualizar lista de tokens creados
      setTokens(updatedTokens);
    } catch (error) {
      setMessage("Error al crear el token.");
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center", padding: "2rem" }}>
      <h1>Solución CPI</h1>
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
      <button onClick={handleCreateToken}>Crear Token</button>
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
