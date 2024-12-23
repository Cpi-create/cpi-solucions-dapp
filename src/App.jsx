import React, { useState, useEffect } from "react";
import { createToken, getCreatedTokens, transferTokens, getTokenBalance, buyTokens } from "./web3.jsx";

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
  const [buyAmount, setBuyAmount] = useState("");

  const TOKEN_PRICE = 0.05; // Precio fijo: 1 Token = 0.05 USDC

  // Función para conectar MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(accounts[0]);
        setMessage("¡Wallet conectada exitosamente!");
        await fetchTokens(); // Cargar tokens creados
      } catch (error) {
        console.error("Error al conectar MetaMask:", error);
        setMessage("Error al conectar MetaMask.");
      }
    } else {
      setMessage("MetaMask no está instalada.");
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

  // Comprar tokens
  const handleBuyTokens = async () => {
    if (!selectedToken) {
      setMessage("Por favor, selecciona un token antes de comprar.");
      return;
    }

    if (buyAmount <= 0) {
      setMessage("Por favor, ingresa una cantidad válida para comprar.");
      return;
    }

    try {
      setMessage("Procesando compra...");
      const txHash = await buyTokens(selectedToken, buyAmount, TOKEN_PRICE);
      setMessage(`¡Compra exitosa! Hash de la transacción: ${txHash}`);
    } catch (error) {
      console.error("Error al comprar tokens:", error);
      setMessage("Error al comprar tokens.");
    }
  };

  // Transferir tokens
  const handleTransfer = async () => {
    if (!selectedToken) {
      setMessage("Por favor, selecciona un token antes de transferir.");
      return;
    }

    if (!transferAddress || transferAmount <= 0) {
      setMessage("Por favor, ingresa una dirección de destino y una cantidad válida.");
      return;
    }

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
      if (!selectedToken) {
        setMessage("Selecciona un token para consultar su balance.");
        return;
      }
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

      <h2>Comprar Tokens</h2>
      <p>Precio fijo: 1 Token = {TOKEN_PRICE} USDC</p>
      <div>
        <label>Cantidad de tokens a comprar:</label>
        <input
          type="number"
          value={buyAmount}
          onChange={(e) => setBuyAmount(e.target.value)}
          style={{ margin: "0.5rem" }}
        />
      </div>
      <h3>Selecciona un token:</h3>
      <ul>
        {tokens.map((token, index) => (
          <li key={index}>
            {token}{" "}
            <button onClick={() => setSelectedToken(token)}>
              {selectedToken === token ? "Seleccionado ✔" : "Seleccionar"}
            </button>
          </li>
        ))}
      </ul>
      <button onClick={handleBuyTokens} style={{ padding: "0.5rem 1rem" }}>
        Comprar Tokens
      </button>

      <p>{message}</p>

      <h2>Tokens creados</h2>
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
