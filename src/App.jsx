import React, { useState, useEffect } from "react";
import {
  connectWallet,
  isAdmin,
  createToken,
  getCreatedTokens,
  transferTokens,
  buyTokens,
  getTokenBalance,
} from "./web3";

const App = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [createdTokens, setCreatedTokens] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Datos para crear tokens
  const [newToken, setNewToken] = useState({
    name: "",
    symbol: "",
    admin: "",
    usdcToken: "",
    initialSupply: "",
  });

  // Datos para transferir tokens
  const [transferData, setTransferData] = useState({
    tokenAddress: "",
    toAddress: "",
    amount: "",
  });

  // Datos para comprar tokens
  const [buyData, setBuyData] = useState({
    tokenAddress: "",
    amount: "",
    price: "",
  });

  // Balance de tokens
  const [userBalance, setUserBalance] = useState("");

  // Conectar MetaMask y verificar privilegios
  useEffect(() => {
    const initConnection = async () => {
      try {
        setIsLoading(true);
        const address = await connectWallet();
        setWalletAddress(address);

        const adminStatus = await isAdmin(address);
        setIsUserAdmin(adminStatus);

        const tokens = await getCreatedTokens();
        setCreatedTokens(tokens);
        setStatusMessage("");
      } catch (error) {
        console.error("Error al inicializar la conexión:", error.message);
        setStatusMessage("No se pudo conectar correctamente.");
      } finally {
        setIsLoading(false);
      }
    };

    initConnection();
  }, []);

  // Crear token (solo administrador)
  const handleCreateToken = async () => {
    try {
      const { name, symbol, admin, usdcToken, initialSupply } = newToken;

      if (!name || !symbol || !admin || !usdcToken || !initialSupply) {
        setStatusMessage("Por favor, completa todos los campos para crear un token.");
        return;
      }

      setIsLoading(true);
      setStatusMessage("Creando token...");
      const txHash = await createToken(name, symbol, admin, usdcToken, initialSupply);
      setStatusMessage(`Token creado exitosamente. Hash: ${txHash}`);

      // Actualizar lista de tokens creados
      const tokens = await getCreatedTokens();
      setCreatedTokens(tokens);
    } catch (error) {
      console.error("Error al crear el token:", error.message);
      setStatusMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Transferir tokens
  const handleTransferTokens = async () => {
    try {
      const { tokenAddress, toAddress, amount } = transferData;

      if (!tokenAddress || !toAddress || !amount) {
        setStatusMessage("Por favor, completa todos los campos para realizar la transferencia.");
        return;
      }

      setIsLoading(true);
      setStatusMessage("Realizando transferencia...");
      const txHash = await transferTokens(tokenAddress, toAddress, amount);
      setStatusMessage(`Transferencia realizada exitosamente. Hash: ${txHash}`);
    } catch (error) {
      console.error("Error al transferir tokens:", error.message);
      setStatusMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Comprar tokens
  const handleBuyTokens = async () => {
    try {
      const { tokenAddress, amount, price } = buyData;

      if (!tokenAddress || !amount || !price) {
        setStatusMessage("Por favor, completa todos los campos para realizar la compra.");
        return;
      }

      setIsLoading(true);
      setStatusMessage("Realizando compra...");
      const txHash = await buyTokens(tokenAddress, amount, price);
      setStatusMessage(`Compra realizada exitosamente. Hash: ${txHash}`);
    } catch (error) {
      console.error("Error al comprar tokens:", error.message);
      setStatusMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener balance del usuario
  const handleGetBalance = async (tokenAddress) => {
    try {
      setIsLoading(true);
      setStatusMessage("Consultando balance...");
      const balance = await getTokenBalance(tokenAddress, walletAddress);
      setUserBalance(balance);
      setStatusMessage("");
    } catch (error) {
      console.error("Error al obtener balance:", error.message);
      setStatusMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>¡Bienvenido a CPI Financial DApp!</h1>

      {isLoading && <p style={{ color: "blue" }}>Procesando...</p>}

      <p>{walletAddress ? `Cartera conectada: ${walletAddress}` : "Conectando a MetaMask..."}</p>

      {statusMessage && <p style={{ color: "red" }}>{statusMessage}</p>}

      {isUserAdmin ? (
        <div>
          <h2>Funciones del Administrador</h2>
          <h3>Crear Token</h3>
          <input
            placeholder="Nombre"
            value={newToken.name}
            onChange={(e) => setNewToken({ ...newToken, name: e.target.value })}
          />
          <input
            placeholder="Símbolo"
            value={newToken.symbol}
            onChange={(e) => setNewToken({ ...newToken, symbol: e.target.value })}
          />
          <input
            placeholder="Dirección del Admin"
            value={newToken.admin}
            onChange={(e) => setNewToken({ ...newToken, admin: e.target.value })}
          />
          <input
            placeholder="Dirección del USDC"
            value={newToken.usdcToken}
            onChange={(e) => setNewToken({ ...newToken, usdcToken: e.target.value })}
          />
          <input
            placeholder="Supply Inicial"
            value={newToken.initialSupply}
            onChange={(e) => setNewToken({ ...newToken, initialSupply: e.target.value })}
          />
          <button onClick={handleCreateToken}>Crear Token</button>
        </div>
      ) : (
        <p style={{ color: "red" }}>Acceso restringido: Solo para administradores.</p>
      )}

      <div>
        <h2>Tokens Creados</h2>
        {createdTokens.length > 0 ? (
          createdTokens.map((token, index) => (
            <div key={index}>
              <p>{token}</p>
              <button onClick={() => handleGetBalance(token)}>Consultar Balance</button>
            </div>
          ))
        ) : (
          <p>No se han creado tokens aún.</p>
        )}
      </div>

      <div>
        <h2>Transferir Tokens</h2>
        <input
          placeholder="Dirección del Token"
          value={transferData.tokenAddress}
          onChange={(e) => setTransferData({ ...transferData, tokenAddress: e.target.value })}
        />
        <input
          placeholder="Dirección de Destino"
          value={transferData.toAddress}
          onChange={(e) => setTransferData({ ...transferData, toAddress: e.target.value })}
        />
        <input
          placeholder="Cantidad"
          value={transferData.amount}
          onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
        />
        <button onClick={handleTransferTokens}>Transferir</button>
      </div>

      <div>
        <h2>Comprar Tokens</h2>
        <input
          placeholder="Dirección del Token"
          value={buyData.tokenAddress}
          onChange={(e) => setBuyData({ ...buyData, tokenAddress: e.target.value })}
        />
        <input
          placeholder="Cantidad"
          value={buyData.amount}
          onChange={(e) => setBuyData({ ...buyData, amount: e.target.value })}
        />
        <input
          placeholder="Precio por Token (USDC)"
          value={buyData.price}
          onChange={(e) => setBuyData({ ...buyData, price: e.target.value })}
        />
        <button onClick={handleBuyTokens}>Comprar</button>
      </div>

      {userBalance && <p>Tu balance es: {userBalance}</p>}
    </div>
  );
};

export default App;
