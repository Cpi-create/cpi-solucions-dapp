import { ethers } from "ethers";

// Dirección del contrato Factory y ABI
const factoryAddress = "0x4A95cEe1C8f20dd3982295271369CA0CE8f5E212"; // Dirección actualizada
const factoryABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "symbol", "type": "string" },
      { "internalType": "address", "name": "admin", "type": "address" },
      { "internalType": "address", "name": "usdcToken", "type": "address" },
      { "internalType": "uint256", "name": "initialSupply", "type": "uint256" }
    ],
    "name": "createToken",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCreatedTokens",
    "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }],
    "stateMutability": "view",
    "type": "function"
  }
];

const tokenABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "recipient", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "transfer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
];

// Función para crear un nuevo token
export const createToken = async (name, symbol, admin, usdcToken, initialSupply) => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const factoryContract = new ethers.Contract(factoryAddress, factoryABI, signer);

    const tx = await factoryContract.createToken(name, symbol, admin, usdcToken, initialSupply);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error("Error al crear el token:", error);
    throw error;
  }
};

// Función para obtener los tokens creados
export const getCreatedTokens = async () => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const factoryContract = new ethers.Contract(factoryAddress, factoryABI, provider);

    const tokens = await factoryContract.getCreatedTokens();
    return tokens;
  } catch (error) {
    console.error("Error al obtener los tokens creados:", error);
    return [];
  }
};

// Función para transferir tokens
export const transferTokens = async (tokenAddress, recipient, amount) => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);

    const tx = await tokenContract.transfer(recipient, amount);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error("Error al transferir tokens:", error);
    throw error;
  }
};

// Función para consultar el balance de un token
export const getTokenBalance = async (tokenAddress) => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);

    const balance = await tokenContract.balanceOf(await signer.getAddress());
    return ethers.formatUnits(balance, 18); // Formatear el balance a unidades legibles
  } catch (error) {
    console.error("Error al consultar el balance del token:", error);
    throw error;
  }
};
