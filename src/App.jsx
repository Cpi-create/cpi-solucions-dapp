import React, { useState, useEffect } from "react";
import { createToken, getCreatedTokens } from "./web3.jsx";

function App() {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [initialSupply, setInitialSupply] = useState("");
  const [message, setMessage] = useState("");
  const [tokens, setTokens] = useState([]);
  const [account, setAccount] = useState(null);

  // Conectar MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]); // Guardar la cuenta conectada
        setMessage("Wallet conectada: " + accounts[0]);
      } catch (error) {
        setMessage("Error al conectar la wallet.");
        console.error(error);
      }
    } else {
      setMessage("MetaMask no está instalado. Por favor, instálalo para usar la DApp.");
    }
  };

  // Obtener la lista de tokens creados al cargar la página
  useEffect(() => {
    async function fetchTokens() {
      const createdTokens = await getCreatedTokens();
      setTokens(createdTokens);
    }
    fetchTokens();
  }, []);

  const handleCreateToken = async () => {
    if (!account) {
      setMessage("Conecta tu wallet antes de crear un token.");
      return;
    }
    try {
      setMessage("Creando token...");
      const txHash = await createToken(name, symbol, account, process.env.REACT_APP_USDC_ADDRESS, initialSupply);
      setMessage(`¡Token creado con éxito! Hash de la transacción: ${txHash}`);
      const updatedTokens = await getCreatedTokens(); // Actualizar lista de tokens creados
      setTokens(updatedTokens);
    } catch (error) {
      setMessage("Error al crear el token.");
      console.error(error);
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center", padding: "2rem" }}>
      <h1>¡Bienvenido a CPI Financial DApp!</h1>
      <h2>Crear un nuevo token</h2>
      
      {/* Botón para conectar wallet */}
      {!account ? (
        <button onClick={connectWallet}>Conectar Wallet</button>
      ) : (
        <p>Wallet conectada: {account}</p>
      )}

      <div style={{ margin: "1rem" }}>
        <input
          type="text"
          placeholder="Nombre del token"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Símbolo del token"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />
        <input
          type="number"
          placeholder="Suministro inicial"
          value={initialSupply}
          onChange={(e) => setInitialSupply(e.target.value)}
        />
        <button onClick={handleCreateToken}>Crear Token</button>
      </div>

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
