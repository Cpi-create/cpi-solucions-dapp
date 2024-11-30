import { ethers } from "ethers";

// Dirección del contrato desplegado (actualízala si cambia)
const contractAddress = "0x1658d712Fea00F25210A3881d87Dc61F4C1016ba";

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
export const getContract = () => {
  if (!window.ethereum) {
    alert("Metamask no está instalado. Por favor, instálalo para continuar.");
    return null;
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(contractAddress, contractABI, signer);
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
    const contract = getContract();
    if (!contract) return;

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
    const contract = getContract();
    if (!contract) return;

    const totalSupply = await contract.totalSupply();
    console.log("Suministro total:", totalSupply.toString());
    return totalSupply;
  } catch (error) {
    console.error("Error al obtener el suministro total:", error);
  }
};
