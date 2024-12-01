import { ethers } from "ethers";

// Dirección del contrato desplegado
const contractAddress = "0x784Ee17d563f055d3287D285155D9a9bfdaceDE5";

// ABI del contrato (fragmento de funciones relevantes)
const contractABI = [
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
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
];

// Configurar el proveedor y contrato
let provider;
let contract;

export const initializeWeb3 = async () => {
  if (!window.ethereum) {
    alert("Metamask no está instalado. Por favor, instálalo para continuar.");
    return null;
  }

  provider = new ethers.BrowserProvider(window.ethereum);
  contract = new ethers.Contract(contractAddress, contractABI, provider);
  return contract;
};

// Conectar Metamask
export const connectWallet = async () => {
  try {
    if (!window.ethereum) {
      alert("Metamask no está instalado. Por favor, instálalo para continuar.");
      return null;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    console.log("Cuenta conectada:", accounts[0]);
    return accounts[0];
  } catch (error) {
    console.error("Error al conectar Metamask:", error);
  }
};

// Obtener el balance de tokens de un usuario
export const getTokenBalance = async (account) => {
  try {
    if (!contract) await initializeWeb3();
    const balance = await contract.balanceOf(account);
    console.log("Balance de tokens:", balance.toString());
    return balance;
  } catch (error) {
    console.error("Error al obtener el balance de tokens:", error);
  }
};

// Obtener el suministro total de tokens
export const getTotalSupply = async () => {
  try {
    if (!contract) await initializeWeb3();
    const totalSupply = await contract.totalSupply();
    console.log("Suministro total:", totalSupply.toString());
    return totalSupply;
  } catch (error) {
    console.error("Error al obtener el suministro total:", error);
  }
};
