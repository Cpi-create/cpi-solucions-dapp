import { ethers } from "ethers";

// Dirección del contrato Factory y USDC
const factoryAddress = "0x4A95cEe1C8f20dd3982295271369CA0CE8f5E212"; // Dirección del contrato Factory
const usdcAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"; // Dirección del contrato USDC en Polygon

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
  },
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "isAdmin",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  }
];

// Crear un token
export const createToken = async (name, symbol, admin, usdcToken, initialSupply) => {
  try {
    console.log("Creando token...");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const factoryContract = new ethers.Contract(factoryAddress, factoryABI, signer);

    if (!ethers.utils.isAddress(admin) || !ethers.utils.isAddress(usdcToken)) {
      throw new Error("Dirección inválida para admin o USDC.");
    }

    const tx = await factoryContract.createToken(name, symbol, admin, usdcToken, initialSupply);
    await tx.wait();
    console.log("Token creado exitosamente, hash de transacción:", tx.hash);
    return tx.hash;
  } catch (error) {
    console.error("Error al crear el token:", error);
    throw error;
  }
};

// Obtener tokens creados
export const getCreatedTokens = async () => {
  try {
    console.log("Obteniendo tokens creados...");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const factoryContract = new ethers.Contract(factoryAddress, factoryABI, provider);

    const tokens = await factoryContract.getCreatedTokens();
    console.log("Tokens creados:", tokens);
    return tokens;
  } catch (error) {
    console.error("Error al obtener los tokens creados:", error);
    return [];
  }
};

// Consultar balance de un token
export const getTokenBalance = async (tokenAddress, userAddress) => {
  try {
    console.log(`Consultando balance de ${userAddress} en el token ${tokenAddress}...`);
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
        "type": "function"
      }
    ];

    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, provider);
    const balance = await tokenContract.balanceOf(userAddress);
    console.log("Balance obtenido:", ethers.utils.formatUnits(balance, 18));
    return ethers.utils.formatUnits(balance, 18);
  } catch (error) {
    console.error("Error al obtener el balance del token:", error);
    return "0";
  }
};

// Transferir tokens
export const transferTokens = async (tokenAddress, toAddress, amount) => {
  try {
    console.log(`Transfiriendo ${amount} tokens desde ${tokenAddress} a ${toAddress}...`);
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
    console.log("Transferencia exitosa, hash de transacción:", tx.hash);
    return tx.hash;
  } catch (error) {
    console.error("Error al transferir tokens:", error);
    throw error;
  }
};

// Comprar tokens
export const buyTokens = async (tokenAddress, amount, price) => {
  try {
    console.log(`Comprando ${amount} tokens a un precio de ${price} USDC por token...`);
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

    const usdcContract = new ethers.Contract(usdcAddress, usdcABI, signer);
    const totalCost = ethers.utils.parseUnits((amount * price).toString(), 6); // USDC usa 6 decimales

    const tx = await usdcContract.transfer(tokenAddress, totalCost);
    await tx.wait();

    console.log("Compra exitosa, hash de transacción:", tx.hash);
    return tx.hash;
  } catch (error) {
    console.error("Error al comprar tokens:", error);
    throw error;
  }
};

// Obtener historial de transacciones
export const getTokenTransactions = async (tokenAddress, userAddress) => {
  try {
    console.log(`Obteniendo historial de transacciones para el token ${tokenAddress} y usuario ${userAddress}...`);

    // Simulación de historial
    const simulatedTransactions = [
      { type: "Compra", amount: 10, hash: "0x123..." },
      { type: "Transferencia", amount: 5, hash: "0x456..." },
      { type: "Recepción", amount: 3, hash: "0x789..." }
    ];

    console.log("Historial simulado:", simulatedTransactions);
    return simulatedTransactions;
  } catch (error) {
    console.error("Error al obtener el historial de transacciones:", error);
    throw error;
  }
};

// Verificar si el usuario es administrador
export const isAdmin = async (userAddress) => {
  try {
    console.log(`Verificando si el usuario ${userAddress} es administrador...`);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const factoryContract = new ethers.Contract(factoryAddress, factoryABI, provider);
    const result = await factoryContract.isAdmin(userAddress);
    console.log("¿Es administrador?", result);
    return result;
  } catch (error) {
    console.error("Error al verificar administrador:", error);
    return false;
  }
};
