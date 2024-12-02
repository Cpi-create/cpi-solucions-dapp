import React, { useEffect, useState } from "react";
import { connectWallet, getTokenBalance, getTotalSupply, transferTokens } from "./web3";

function App() {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState(null);
  const [totalSupply, setTotalSupply] = useState(null);
  const [recipient, setRecipient] = useState(""); // Dirección de destino
  const [amount, setAmount] = useState(""); // Cantidad de tokens a enviar
  const [transferMessage, setTransferMessage] = useState(""); // Mensaje de estado de transferencia

  useEffect(() => {
    async function fetchData() {
      const connectedAccount = await connectWallet();
      setAccount(connectedAccount);

      if (connectedAccount) {
        const balance = await getTokenBalance(connectedAccount);
        const supply = await getTotalSupply();
        setBalance(balance / 1e18);
        setTotalSupply(supply / 1e18);
      }
    }
    fetchData();
  }, []);

  const handleTransfer = async () => {
    if (!recipient || !amount) {
      setTransferMessage("Por favor, ingresa todos los datos.");
      return;
    }

    try {
      const result = await transferTokens(recipient, amount);
      setTransferMessage(`¡Transferencia exitosa! Hash: ${result.hash}`);
    } catch (error) {
      setTransferMessage(`Error al realizar la transferencia: ${error.message}`);
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center", padding: "2rem" }}>
      <h1 style={{ color: "#333" }}>Solución CPI</h1>
      <p style={{ fontSize: "1.2rem", color: "#666" }}>
        Tu portal para interactuar con contratos inteligentes de blockchain.
      </p>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "1.5rem",
          margin: "2rem auto",
          maxWidth: "400px",
          background: "#f9f9f9",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <p>
          <strong>Cuenta conectada:</strong> {account}
        </p>
        <p>
          <strong>Balance de tokens:</strong> {balance !== null ? `${balance} IPC` : "Cargando..."}
        </p>
        <p>
          <strong>Suministro total:</strong> {totalSupply !== null ? `${totalSupply} IPC` : "Cargando..."}
        </p>

        <hr style={{ margin: "2rem 0" }} />

        <h2 style={{ fontSize: "1.5rem", color: "#333" }}>Transferir tokens</h2>
        <div style={{ textAlign: "left" }}>
          <label>
            Dirección de destino:
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                margin: "0.5rem 0",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            />
          </label>
          <label>
            Cantidad a enviar:
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                margin: "0.5rem 0",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            />
          </label>
          <button
            onClick={handleTransfer}
            style={{
              background: "#4CAF50",
              color: "white",
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Enviar tokens
          </button>
        </div>

        {transferMessage && (
          <p style={{ marginTop: "1rem", color: transferMessage.includes("Error") ? "red" : "green" }}>
            {transferMessage}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
