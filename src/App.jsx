import React, { useState, useEffect } from "react";
import { createToken, getCreatedTokens, transferTokens, getTokenBalance, buyTokens, getTokenTransactions } from "./web3.jsx";

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
  const [transactions, setTransactions] = useState([]); // Historial de transacciones

  const TOKEN_PRICE = 0.05; // Precio fijo: 1 Token = 0.05 USDC

  // Función para conectar MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(accounts[0]);
        setMessage("¡Wallet conectada exitosamente!");
        fetchTokens();
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
      fetchTransactions(); // Actualizar historial
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
      fetchTransactions(); // Actualizar historial
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

  // Obtener historial de transacciones
  const fetchTransactions = async () => {
    try {
      if (!selectedToken) {
        setMessage("Selecciona un token para ver su historial de transacciones.");
        return;
      }
      const txs = await getTokenTransactions(selectedToken, walletAddress);
      setTransactions(txs);
    } catch (error) {
      console.error("Error al obtener el historial de transacciones:", error);
      setMessage("Error al obtener el historial de transacciones.");
    }
  };

  // Obtener lista de tokens al cargar la página
  useEffect(() => {
    fetchTokens();
  }, []);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center", padding: "2rem", background: "black", color: "white" }}>
      {/* Encabezado con el logo */}
      <div style={{ marginBottom: "2rem" }}>
        <img src="/sfi-logo.jpeg" alt="Logo de SFI" style={{ height: "120px", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(255, 215, 0, 0.5)" }} />
        <h1 style={{ color: "gold", marginTop: "1rem" }}>¡Bienvenido a CPI Financial DApp!</h1>
      </div>
      
      {/* Conectar Wallet */}
      <button onClick={connectWallet} style={{ marginBottom: "1rem", padding: "0.5rem 1rem", background: "gold", border: "none", borderRadius: "5px", color: "black" }}>
        {walletAddress ? `Wallet Conectada: ${walletAddress}` : "Conectar Wallet"}
      </button>

      {/* Compra de Tokens */}
      <h2 style={{ color: "gold" }}>Comprar Tokens</h2>
      <p>Precio fijo: 1 Token = {TOKEN_PRICE} USDC</p>
      <div>
        <label>Cantidad de tokens a comprar:</label>
        <input
          type="number"
          value={buyAmount}
          onChange={(e) => setBuyAmount(e.target.value)}
          style={{ margin: "0.5rem", padding: "0.3rem" }}
        />
      </div>
      <button onClick={handleBuyTokens} style={{ padding: "0.5rem 1rem", background: "gold", border: "none", borderRadius: "5px", color: "black" }}>
        Comprar Tokens
      </button>
      <p>{message}</p>

      {/* Selección de Tokens */}
      <h2 style={{ color: "gold" }}>Selecciona un token:</h2>
      <ul>
        {tokens.map((token, index) => (
          <li key={index} style={{ listStyle: "none", marginBottom: "0.5rem" }}>
            {token}{" "}
            <button
              onClick={() => setSelectedToken(token)}
              style={{
                background: selectedToken === token ? "limegreen" : "gray",
                color: "white",
                border: "none",
                borderRadius: "3px",
                padding: "0.3rem",
              }}
            >
              {selectedToken === token ? "Seleccionado ✅" : "Seleccionar"}
            </button>
          </li>
        ))}
      </ul>

      {/* Operaciones con Tokens */}
      {selectedToken && (
        <div style={{ marginTop: "2rem" }}>
          <h2 style={{ color: "gold" }}>Operaciones con el token seleccionado</h2>
          <p>Dirección del token: {selectedToken}</p>
          <button onClick={checkBalance} style={{ padding: "0.5rem 1rem", marginBottom: "1rem", background: "gold", border: "none", borderRadius: "5px", color: "black" }}>
            Consultar balance
          </button>
          <p>Balance: {tokenBalance}</p>
          <h3 style={{ color: "gold" }}>Historial de transacciones</h3>
          <ul>
            {transactions.map((tx, index) => (
              <li key={index}>
                {tx.type}: {tx.amount} tokens - Hash: {tx.hash}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
