import React, { useState } from "react";
import { createToken } from "./web3";

function App() {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [admin, setAdmin] = useState("");
  const [usdcToken, setUsdcToken] = useState("");
  const [initialSupply, setInitialSupply] = useState("");
  const [message, setMessage] = useState("");

  const handleCreateToken = async () => {
    try {
      const txHash = await createToken(name, symbol, admin, usdcToken, initialSupply);
      setMessage(`¡Token creado con éxito! Hash de la transacción: ${txHash}`);
    } catch (error) {
      setMessage("Error al crear el token.");
    }
  };

  return (
    <div>
      <h1>Solución CPI</h1>
      <h2>Crear un nuevo token</h2>
      <div>
        <label>Nombre del token:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label>Símbolo del token:</label>
        <input type="text" value={symbol} onChange={(e) => setSymbol(e.target.value)} />
      </div>
      <div>
        <label>Dirección del administrador:</label>
        <input type="text" value={admin} onChange={(e) => setAdmin(e.target.value)} />
      </div>
      <div>
        <label>Dirección del contrato USDC:</label>
        <input type="text" value={usdcToken} onChange={(e) => setUsdcToken(e.target.value)} />
      </div>
      <div>
        <label>Cantidad inicial de tokens:</label>
        <input type="number" value={initialSupply} onChange={(e) => setInitialSupply(e.target.value)} />
      </div>
      <button onClick={handleCreateToken}>Crear Token</button>
      <p>{message}</p>
    </div>
  );
}

export default App;
