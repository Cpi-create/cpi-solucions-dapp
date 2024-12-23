import React, { useState, useEffect } from "react";
import { createToken, getCreatedTokens, transferTokens, getTokenBalance } from "./web3.jsx";

function App() {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [initialSupply, setInitialSupply] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [message, setMessage] = useState("");
  const [tokens, setTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState("");
  const [transferAddress, setTransferAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [tokenBalance, setTokenBalance] = useState("");

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

  // Crear un nuevo token (Solo administrador)
  const handleCreateToken = async () => {
    try {
      setMessage("Creando token...");
      const txHash = await createToken(name, symbol, walletAddress, "<USDC_CONTRACT_ADDRESS>", initialSupply);
      setMessage(`¡Token creado con éxito! Hash de la transacción: ${txHash}`);
      await fetchTokens(); // Actualizar lista de tokens
    } catch (error) {
      console.error("Error al crear el token:", error);
      setMessage("Error al crear el token.");
    }
  };

  // Obtener tokens creados
  const fetchTokens = async () => {
    try {
      const createdTokens = await getCreatedTokens();
      setTokens(createdTokens);
    } catch (error) {
      console.error("Error al obtener los tokens creados:", error);
    }
  };

  // Transferir tokens
  const handleTransfer = async () => {
    try {
      setMessage("Realizando transferencia...");
      const txHash = await transferTokens(selectedToken, transferAddress, transferAmount);
      setMessage(`¡Transferencia exitosa! Hash de la transacción: ${txHash}`);
    } catch (error) {
      console.error("Error al transferir tokens:", error);
      setMessage("Error al transferir tokens.");
    }
  };

  // Consultar balance de un token
  const checkBalance = async () => {
    try {
      const balance = await getTokenBalance(selectedToken, walletAddress);
      setTokenBalance(balance);
    } catch (error) {
      console.error("Error al consultar el balance:", error);
      setMessage("Error al consultar el balance.");
    }
  };

  // Obtener lista de tokens al cargar la página
  useEffect(() => {
    fetchTokens();
  }, []);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center", padding: "2rem" }}>
      <h1>¡Bienvenido a CPI Financial DApp!</h1>
      <button onClick={connectWallet} style={{ marginBottom: "1rem", padding: "0.5rem 1rem" }}>
        {walletAddress ? `Wallet Conectada: ${walletAddress}` : "Conectar Wallet"}
      </button>
      {walletAddress === "0xc29C9bd0BC978dFCAd34Be1AE66D8E785C152c55" ? (
        <>
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
        </>
      ) : (
        <h2>Tokens creados</h2>
      )}
      <ul>
        {tokens.map((token, index) => (
          <li key={index}>
            {token}{" "}
            <button onClick={() => setSelectedToken(token)}>Seleccionar</button>
          </li>
        ))}
      </ul>
      {selectedToken && (
        <>
          <h2>Operaciones con el token seleccionado</h2>
          <p>Dirección del token: {selectedToken}</p>
          <button onClick={checkBalance}>Consultar balance</button>
          <p>Balance: {tokenBalance}</p>
          <h3>Transferir tokens</h3>
          <div>
            <label>Dirección de destino:</label>
            <input type="text" value={transferAddress} onChange={(e) => setTransferAddress(e.target.value)} />
          </div>
          <div>
            <label>Cantidad a transferir:</label>
            <input type="number" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} />
          </div>
          <button onClick={handleTransfer}>Transferir</button>
        </>
      )}
    </div>
  );
}

export default App;
