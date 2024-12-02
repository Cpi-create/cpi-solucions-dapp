import { ethers } from "ethers";

// Dirección del contrato y ABI (reemplaza con las que corresponden a tu caso)
const contractAddress = "0x784Ee17d563f055d3287D285155D9a9bfdaceDE5"; // Dirección del contrato desplegado
const contractABI = [
  // Agrega aquí tu ABI completo
];

// Configurar proveedor y contrato
const getContract = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(contractAddress, contractABI, signer);
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
    return null;
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
    return null;
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
    return null;
  }
};
