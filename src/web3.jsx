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
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
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
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const factoryContract = new ethers.Contract(factoryAddress, factoryABI, provider);

    const tokens = await factoryContract.getCreatedTokens();
    return tokens;
  } catch (error) {
    console.error("Error al obtener los tokens creados:", error);
    return [];
  }
};

// Función para obtener el balance de un token específico
export const getTokenBalance = async (tokenAddress, userAddress) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const tokenABI = [
      {
        "constant": true,
        "inputs": [{ "name": "owner", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "name": "balance", "type": "uint256" }],
        "type": "function",
      },
    ];

    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, provider);
    const balance = await tokenContract.balanceOf(userAddress);
    return ethers.utils.formatUnits(balance, 18);
  } catch (error) {
    console.error("Error al obtener el balance del token:", error);
    return "0";
  }
};

// Función para transferir tokens a otro usuario
export const transferTokens = async (tokenAddress, toAddress, amount) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const tokenABI = [
      {
        "constant": false,
        "inputs": [
          { "name": "to", "type": "address" },
          { "name": "value", "type": "uint256" }
        ],
        "name": "transfer",
        "outputs": [{ "name": "", "type": "bool" }],
        "type": "function"
      }
    ];

    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
    const formattedAmount = ethers.utils.parseUnits(amount.toString(), 18);

    const tx = await tokenContract.transfer(toAddress, formattedAmount);
    await tx.wait();

    return tx.hash;
  } catch (error) {
    console.error("Error al transferir tokens:", error);
    throw error;
  }
};
