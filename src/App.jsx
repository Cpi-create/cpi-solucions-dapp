import React, { useState, useEffect } from "react";
import { createToken, getCreatedTokens, transferTokens, getTokenBalance, buyTokens, getTokenTransactions, isAdmin } from "./web3.jsx";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [message, setMessage] = useState("");
  const [tokens, setTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState("");
  const [tokenBalance, setTokenBalance] = useState("");
  const [buyAmount, setBuyAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [transferAddress, setTransferAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [isCreator, setIsCreator] = useState(false); // Estado para determinar si es creador
  const [name, setName] = useState(""); // Para crear tokens
  const [symbol, setSymbol] = useState(""); // Para crear tokens
  const [initialSupply, setInitialSupply] = useState(""); // Para crear tokens

  const TOKEN_PRICE = 0.05; // Precio fijo: 1 Token = 0.05 USDC
  const FACTORY_ADDRESS = "0x4A95cEe1C8f20dd3982295271369CA0CE8f5E212"; // Dirección del contrato Factory

  // Conectar MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(accounts[0]);
        setMessage("¡Wallet conectada exitosamente!");
        fetchTokens();
        verifyAdmin(accounts[0]); // Verificar si es administrador
      } catch (error) {
        console.error("Error al conectar MetaMask:", error);
        setMessage("Error al conectar MetaMask.");
      }
    } else {
      setMessage("MetaMask no está instalada.");
    }
  };

  // Verificar si el usuario es administrador
  const verifyAdmin = async (address) => {
    try {
      setMessage("Verificando si el usuario es administrador...");
      const adminStatus = await isAdmin(address, FACTORY_ADDRESS);
      setIsCreator(adminStatus);
      setMessage("");
    } catch (error) {
      console.error("Error al verificar si el usuario es administrador:", error);
      setMessage("Error al verificar el rol de administrador.");
    }
  };

  // Obtener tokens creados
  const fetchTokens = async () => {
    try {
      setMessage("Obteniendo tokens creados...");
      const createdTokens = await getCreatedTokens();
      setTokens(createdTokens);
      setMessage("");
    } catch (error) {
      console.error("Error al obtener los tokens creados:", error);
      setMessage("Error al obtener los tokens creados.");
    }
  };

  // Consultar balance
  const checkBalance = async () => {
    try {
      if (!selectedToken) {
        setMessage("Selecciona un token para consultar su balance.");
        return;
      }
      setMessage("Consultando balance...");
      const balance = await getTokenBalance(selectedToken, walletAddress);
      setTokenBalance(balance);
      setMessage("");
    } catch (error) {
      console.error("Error al consultar el balance:", error);
      setMessage("Error al consultar el balance.");
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
      checkBalance();
      fetchTransactions();
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
      fetchTransactions();
      checkBalance();
    } catch (error) {
      console.error("Error al transferir tokens:", error);
      setMessage("Error al transferir tokens.");
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

  // Crear tokens (solo para el creador)
  const handleCreateToken = async () => {
    try {
      setMessage("Creando token...");
      const txHash = await createToken(name, symbol, walletAddress, "<USDC_CONTRACT_ADDRESS>", initialSupply);
      setMessage(`¡Token creado! Hash de la transacción: ${txHash}`);
      fetchTokens(); // Actualizar lista de tokens
    } catch (error) {
      console.error("Error al crear token:", error);
      setMessage("Error al crear token.");
    }
  };

  useEffect(() => {
    if (walletAddress) {
      fetchTokens();
    }
  }, [walletAddress]);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center", padding: "2rem", background: "black", color: "white" }}>
      <div style={{ marginBottom: "2rem" }}>
        <img
          src="/sfi-logo.jpeg"
          alt="Logo de SFI"
          style={{ height: "120px", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(255, 215, 0, 0.5)" }}
        />
        <h1 style={{ color: "gold", marginTop: "1rem" }}>¡Bienvenido a CPI Financial DApp!</h1>
      </div>

      <button
        onClick={connectWallet}
        style={{ marginBottom: "1rem", padding: "0.5rem 1rem", background: "gold", border: "none", borderRadius: "5px", color: "black" }}
      >
        {walletAddress ? `Wallet Conectada: ${walletAddress}` : "Conectar Wallet"}
      </button>

      {isCreator ? (
        <div>
          <h2 style={{ color: "gold" }}>Crear Nuevo Token</h2>
          <input type="text" placeholder="Nombre del Token" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="text" placeholder="Símbolo del Token" value={symbol} onChange={(e) => setSymbol(e.target.value)} />
          <input type="number" placeholder="Suministro Inicial" value={initialSupply} onChange={(e) => setInitialSupply(e.target.value)} />
          <button onClick={handleCreateToken}>Crear Token</button>
        </div>
      ) : (
        <div>
          <h2 style={{ color: "gold" }}>Comprar Tokens</h2>
          <input type="number" value={buyAmount} onChange={(e) => setBuyAmount(e.target.value)} />
          <button onClick={handleBuyTokens}>Comprar Tokens</button>
        </div>
      )}
    </div>
  );
}

export default App;
