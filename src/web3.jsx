import { ethers } from "ethers";

// Dirección del contrato Factory y USDC
const factoryAddress = "0xb126fb8453ba9331ebfba556a5570f0afd80ac36e5973123ad0496dd1041d548";
const usdcAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"; // Dirección del contrato USDC en Polygon

// ABI del contrato Factory
const factoryABI = [
  {
    inputs: [
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "symbol", type: "string" },
      { internalType: "address", name: "admin", type: "address" },
      { internalType: "address", name: "usdcToken", type: "address" },
      { internalType: "uint256", name: "initialSupply", type: "uint256" },
    ],
    name: "createToken",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getCreatedTokens",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "isAdmin",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
];

// Función para conectar MetaMask y verificar red
export const connectWallet = async () => {
  try {
    if (!window.ethereum) {
      throw new Error("MetaMask no está instalada. Por favor, instálala para usar esta DApp.");
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    const network = await provider.getNetwork();

    if (network.chainId.toString() !== "137") {
      throw new Error("Por favor, conecta MetaMask a la red de Polygon.");
    }

    console.log("Wallet conectada:", accounts[0]);
    return accounts[0];
  } catch (error) {
    console.error("Error al conectar la wallet:", error.message);
    throw error;
  }
};

// Verificar si el usuario es administrador
export const isAdmin = async (userAddress) => {
  try {
    if (!ethers.utils.isAddress(userAddress)) {
      throw new Error("La dirección proporcionada no es válida.");
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const factoryContract = new ethers.Contract(factoryAddress, factoryABI, provider);

    const result = await factoryContract.isAdmin(userAddress);
    console.log("¿Es administrador?:", result);
    return result;
  } catch (error) {
    console.error("Error al verificar administrador:", error.message);
    throw new Error("No se pudo verificar si el usuario es administrador.");
  }
};

// Crear token
export const createToken = async (name, symbol, admin, usdcToken, initialSupply) => {
  try {
    if (!ethers.utils.isAddress(admin) || !ethers.utils.isAddress(usdcToken)) {
      throw new Error("Dirección inválida para admin o USDC.");
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const factoryContract = new ethers.Contract(factoryAddress, factoryABI, signer);

    const tx = await factoryContract.createToken(name, symbol, admin, usdcToken, initialSupply);
    await tx.wait();
    console.log("Token creado exitosamente, hash de transacción:", tx.hash);
    return tx.hash;
  } catch (error) {
    console.error("Error al crear el token:", error.message);
    throw error;
  }
};

// Obtener tokens creados
export const getCreatedTokens = async () => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const factoryContract = new ethers.Contract(factoryAddress, factoryABI, provider);

    const tokens = await factoryContract.getCreatedTokens();
    console.log("Tokens creados:", tokens);
    return tokens;
  } catch (error) {
    console.error("Error al obtener los tokens creados:", error.message);
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
        constant: true,
        inputs: [{ name: "owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "balance", type: "uint256" }],
        type: "function",
      },
    ];

    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, provider);
    const balance = await tokenContract.balanceOf(userAddress);
    console.log("Balance obtenido:", ethers.utils.formatUnits(balance, 18));
    return ethers.utils.formatUnits(balance, 18);
  } catch (error) {
    console.error("Error al obtener el balance del token:", error.message);
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
        constant: false,
        inputs: [
          { name: "to", type: "address" },
          { name: "value", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ name: "", type: "bool" }],
        type: "function",
      },
    ];

    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
    const formattedAmount = ethers.utils.parseUnits(amount.toString(), 18);

    const tx = await tokenContract.transfer(toAddress, formattedAmount);
    await tx.wait();
    console.log("Transferencia exitosa, hash de transacción:", tx.hash);
    return tx.hash;
  } catch (error) {
    console.error("Error al transferir tokens:", error.message);
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
        constant: false,
        inputs: [
          { name: "recipient", type: "address" },
          { name: "amount", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ name: "", type: "bool" }],
        type: "function",
      },
    ];

    const usdcContract = new ethers.Contract(usdcAddress, usdcABI, signer);
    const totalCost = ethers.utils.parseUnits((amount * price).toString(), 6);

    const tx = await usdcContract.transfer(tokenAddress, totalCost);
    await tx.wait();
    console.log("Compra exitosa, hash de transacción:", tx.hash);
    return tx.hash;
  } catch (error) {
    console.error("Error al comprar tokens:", error.message);
    throw error;
  }
};

// Historial de transacciones (simulación)
export const getTokenTransactions = async (tokenAddress, userAddress) => {
  try {
    console.log(`Obteniendo historial de transacciones para el token ${tokenAddress} y usuario ${userAddress}...`);

    const simulatedTransactions = [
      { type: "Compra", amount: 10, hash: "0x123..." },
      { type: "Transferencia", amount: 5, hash: "0x456..." },
      { type: "Recepción", amount: 3, hash: "0x789..." },
    ];

    console.log("Historial simulado:", simulatedTransactions);
    return simulatedTransactions;
  } catch (error) {
    console.error("Error al obtener el historial de transacciones:", error.message);
    throw error;
  }
};
