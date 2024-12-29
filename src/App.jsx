import React, { useState, useEffect } from "react";
import {
  connectWallet,
  isAdmin,
  createToken,
  getCreatedTokens,
  transferTokens,
  buyTokens,
} from "./web3";

const App = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [createdTokens, setCreatedTokens] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");

  // Datos para crear tokens (solo administrador)
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

  // Conectar MetaMask y verificar privilegios
  useEffect(() => {
    const initConnection = async () => {
      try {
        const address = await connectWallet();
        setWalletAddress(address);

        const adminStatus = await isAdmin(address);
        setIsUserAdmin(adminStatus);

        const tokens = await getCreatedTokens();
        setCreatedTokens(tokens);
      } catch (error) {
        console.error("Error al inicializar la conexión:", error.message);
        setStatusMessage(error.message);
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

      setStatusMessage("Creando token...");
      const txHash = await createToken(name, symbol, admin, usdcToken, initialSupply);
      setStatusMessage(`Token creado exitosamente. Hash: ${txHash}`);

      // Actualizar lista de tokens creados
      const tokens = await getCreatedTokens();
      setCreatedTokens(tokens);
    } catch (error) {
      console.error("Error al crear el token:", error.message);
      setStatusMessage(`Error: ${error.message}`);
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

      setStatusMessage("Realizando transferencia...");
      const txHash = await transferTokens(tokenAddress, toAddress, amount);
      setStatusMessage(`Transferencia realizada exitosamente. Hash: ${txHash}`);
    } catch (error) {
      console.error("Error al transferir tokens:", error.message);
      setStatusMessage(`Error: ${error.message}`);
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

      setStatusMessage("Realizando compra...");
      const txHash = await buyTokens(tokenAddress, amount, price);
      setStatusMessage(`Compra realizada exitosamente. Hash: ${txHash}`);
    } catch (error) {
      console.error("Error al comprar tokens:", error.message);
      setStatusMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>¡Bienvenido a CPI Financial DApp!</h1>

      {/* Estado de conexión */}
      <p>
        {walletAddress
          ? `Cartera conectada: ${walletAddress}`
          : "Conectando a MetaMask..."}
      </p>

      {/* Mensaje de estado */}
      {statusMessage && <p style={{ color: "red" }}>{statusMessage}</p>}

      {/* Funciones para el administrador */}
      {isUserAdmin ? (
        <div>
          <h2>Funciones del Administrador</h2>
          <h3>Crear un Token</h3>
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
            onChange={(e) =>
              setNewToken({ ...newToken, initialSupply: e.target.value })
            }
          />
          <button onClick={handleCreateToken}>Crear Token</button>
        </div>
      ) : (
        <p style={{ color: "red" }}>
          No se pudo verificar si el usuario es administrador. Acceso limitado.
        </p>
      )}

      {/* Listado de tokens creados */}
      <div>
        <h2>Tokens Creados</h2>
        {createdTokens.length > 0 ? (
          <ul>
            {createdTokens.map((token, index) => (
              <li key={index}>{token}</li>
            ))}
          </ul>
        ) : (
          <p>No se han creado tokens aún.</p>
        )}
      </div>

      {/* Función de transferencia */}
      <div>
        <h2>Transferir Tokens</h2>
        <input
          placeholder="Dirección del Token"
          value={transferData.tokenAddress}
          onChange={(e) =>
            setTransferData({ ...transferData, tokenAddress: e.target.value })
          }
        />
        <input
          placeholder="Dirección de Destino"
          value={transferData.toAddress}
          onChange={(e) =>
            setTransferData({ ...transferData, toAddress: e.target.value })
          }
        />
        <input
          placeholder="Cantidad"
          value={transferData.amount}
          onChange={(e) =>
            setTransferData({ ...transferData, amount: e.target.value })
          }
        />
        <button onClick={handleTransferTokens}>Transferir</button>
      </div>

      {/* Función de compra */}
      <div>
        <h2>Comprar Tokens</h2>
        <input
          placeholder="Dirección del Token"
          value={buyData.tokenAddress}
          onChange={(e) =>
            setBuyData({ ...buyData, tokenAddress: e.target.value })
          }
        />
        <input
          placeholder="Cantidad"
          value={buyData.amount}
          onChange={(e) =>
            setBuyData({ ...buyData, amount: e.target.value })
          }
        />
        <input
          placeholder="Precio por Token (USDC)"
          value={buyData.price}
          onChange={(e) =>
            setBuyData({ ...buyData, price: e.target.value })
          }
        />
        <button onClick={handleBuyTokens}>Comprar</button>
      </div>
    </div>
  );
};

export default App;
