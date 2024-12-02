import { ethers } from "ethers";

// Dirección del contrato Factory y ABI
const factoryAddress = "0x7faDdAFeDC0eFC895bb09bAF1e7146f73a961E9b"; // Dirección del contrato Factory
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

export const createToken = async (name, symbol, admin, usdcToken, initialSupply) => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const factoryContract = new ethers.Contract(factoryAddress, factoryABI, signer);

    const tx = await factoryContract.createToken(name, symbol, admin, usdcToken, initialSupply);
    await tx.wait();

    return tx.hash; // Devuelve el hash de la transacción
  } catch (error) {
    console.error("Error al crear el token:", error);
    throw error;
  }
};

export const getCreatedTokens = async () => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const factoryContract = new ethers.Contract(factoryAddress, factoryABI, provider);

    const tokens = await factoryContract.getCreatedTokens();
    return tokens; // Devuelve la lista de direcciones de los tokens creados
  } catch (error) {
    console.error("Error al obtener los tokens creados:", error);
    return [];
  }
};
