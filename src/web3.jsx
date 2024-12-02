import { ethers } from "ethers";

// Dirección del contrato y ABI (actualiza con tu contrato desplegado y su ABI)
const contractAddress = "0x784Ee17d563f055d3287D285155D9a9bfdaceDE5"; // Dirección del contrato desplegado
const contractABI = [
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "to", type: "address" }, { internalType: "uint256", name: "amount", type: "uint256" }],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// Obtener el contrato configurado
const getContract = async () => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(contractAddress, contractABI, signer);
  } catch (error) {
    console.error("Error al obtener el contrato:", error);
    throw error;
  }
};

// Conectar la wallet
export const connectWallet = async () => {
  try {
    if (!window.ethereum) {
      throw new Error("MetaMask no está instalado");
    }
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    return accounts[0]; // Devuelve la dirección de la cuenta conectada
  } catch (error) {
    console.error("Error al conectar la wallet:", error);
    throw error;
  }
};

// Obtener balance de tokens
export const getTokenBalance = async (address) => {
  try {
    const contract = await getContract();
    const balance = await contract.balanceOf(address);
    return balance;
  } catch (error) {
    console.error("Error al obtener el balance de tokens:", error);
    throw error;
  }
};

// Obtener suministro total de tokens
export const getTotalSupply = async () => {
  try {
    const contract = await getContract();
    const totalSupply = await contract.totalSupply();
    return totalSupply;
  } catch (error) {
    console.error("Error al obtener el suministro total:", error);
    throw error;
  }
};

// Transferir tokens
export const transferTokens = async (toAddress, amount) => {
  try {
    const contract = await getContract();
    const amountInWei = ethers.parseUnits(amount.toString(), 18); // Convertir a Wei (18 decimales)
    const tx = await contract.transfer(toAddress, amountInWei);
    await tx.wait(); // Esperar a que se confirme la transacción
    console.log(`Tokens transferidos: ${amount} a ${toAddress}`);
    return tx;
  } catch (error) {
    console.error("Error al transferir tokens:", error);
    throw error;
  }
};

// Exportar todas las funciones
export {
  connectWallet,
  getTokenBalance,
  getTotalSupply,
  transferTokens,
};
