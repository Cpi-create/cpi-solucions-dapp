import React, { useEffect, useState } from "react";
import { connectWallet, getTokenBalance, getTotalSupply } from "./web3";

function App() {
    const [connectedAccount, setConnectedAccount] = useState(null);
    const [tokenBalance, setTokenBalance] = useState("Cargando...");
    const [totalSupply, setTotalSupply] = useState("Cargando...");

    useEffect(() => {
        async function fetchData() {
            const account = await connectWallet();
            setConnectedAccount(account);

            if (account) {
                const balance = await getTokenBalance(account);
                setTokenBalance(balance ? `${balance} CPI` : "No disponible");

                const supply = await getTotalSupply();
                setTotalSupply(supply ? `${supply} CPI` : "No disponible");
            }
        }

        fetchData();
    }, []);

    return (
        <div style={{ textAlign: "center", margin: "2rem" }}>
            <h1>Solución CPI</h1>
            <p>Tu portal para interactuar con contratos inteligentes de blockchain.</p>
            <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px", display: "inline-block" }}>
                <p>
                    <strong>Cuenta conectada:</strong> {connectedAccount || "Conecta tu wallet"}
                </p>
                <p>
                    <strong>Balance de tokens:</strong> {tokenBalance}
                </p>
                <p>
                    <strong>Suministro total:</strong> {totalSupply}
                </p>
            </div>
        </div>
    );
}

export default App;
