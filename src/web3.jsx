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

// Función para crear un nuevo token
export const createToken = async (name, symbol, admin, usdcToken, initialSupply) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum); // Conexión a la wallet
    const signer = provider.getSigner(); // Usuario conectado
    const factoryContract = new ethers.Contract(factoryAddress, factoryABI, signer);

    // Llamada a la función createToken del contrato
    const tx = await factoryContract.createToken(name, symbol, admin, usdcToken, initialSupply);
    await tx.wait(); // Espera a que la transacción se confirme

    return tx.hash; // Devuelve el hash de la transacción
  } catch (error) {
    console.error("Error al crear el token:", error);
    throw error;
  }
};

// Función para obtener los tokens creados
export const getCreatedTokens = async () => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum); // Conexión a la wallet
    const factoryContract = new ethers.Contract(factoryAddress, factoryABI, provider);

    const tokens = await factoryContract.getCreatedTokens();
    return tokens; // Devuelve la lista de direcciones de los tokens creados
  } catch (error) {
    console.error("Error al obtener los tokens creados:", error);
    return [];
  }
};
