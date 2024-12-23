import { ethers } from "ethers";

// Dirección del contrato Factory y ABI
const factoryAddress = "0x4A95cEe1C8f20dd3982295271369CA0CE8f5E212"; // Actualiza si cambia
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

// Crear un token
export const createToken = async (name, symbol, admin, usdcToken, initialSupply) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const factoryContract = new ethers.Contract(factoryAddress, factoryABI, signer);

    if (!ethers.utils.isAddress(admin) || !ethers.utils.isAddress(usdcToken)) {
      throw new Error("Dirección inválida para admin o USDC.");
    }

    const tx = await factoryContract.createToken(name, symbol, admin, usdcToken, initialSupply);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error("Error al crear el token:", error);
    throw error;
  }
};

// Obtener tokens creados
export const getCreatedTokens = async () => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const factoryContract = new ethers.Contract(factoryAddress, factoryABI, provider);

    return await factoryContract.getCreatedTokens();
  } catch (error) {
    console.error("Error al obtener los tokens creados:", error);
    return [];
  }
};

// Consultar balance de un token
export const getTokenBalance = async (tokenAddress, userAddress) => {
  try {
    if (!ethers.utils.isAddress(tokenAddress) || !ethers.utils.isAddress(userAddress)) {
      throw new Error("Dirección inválida para el token o usuario.");
    }

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

// Transferir tokens
export const transferTokens = async (tokenAddress, toAddress, amount) => {
  try {
    if (!ethers.utils.isAddress(tokenAddress) || !ethers.utils.isAddress(toAddress)) {
      throw new Error("Dirección inválida para el token o destino.");
    }

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

// Comprar tokens
export const buyTokens = async (tokenAddress, amount, price) => {
  try {
    if (!ethers.utils.isAddress(tokenAddress)) {
      throw new Error("Dirección de token inválida.");
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const usdcABI = [
      {
        "constant": false,
        "inputs": [
          { "name": "recipient", "type": "address" },
          { "name": "amount", "type": "uint256" }
        ],
        "name": "transfer",
        "outputs": [{ "name": "", "type": "bool" }],
        "type": "function"
      }
    ];

    const usdcAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"; // Dirección de USDC en Polygon
    const usdcContract = new ethers.Contract(usdcAddress, usdcABI, signer);

    const totalCost = ethers.utils.parseUnits((amount * price).toString(), 6); // USDC usa 6 decimales

    const tx = await usdcContract.transfer(tokenAddress, totalCost);
    await tx.wait();

    return tx.hash;
  } catch (error) {
    console.error("Error al comprar tokens:", error);
    throw error;
  }
};
