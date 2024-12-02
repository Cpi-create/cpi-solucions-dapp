import { ethers } from "ethers";

// Dirección del contrato de la fábrica (actualiza esta dirección con la que hayas desplegado)
const factoryAddress = "0x7faDdAFeDC0eFC895bb09bAF1e7146f73a961E9b";
const factoryABI = [
  {
    inputs: [
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "symbol", type: "string" },
      { internalType: "address", name: "admin", type: "address" },
      { internalType: "address", name: "usdcToken", type: "address" },
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
];

// Configurar proveedor y contrato
const getFactoryContract = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(factoryAddress, factoryABI, signer);
};

// Conectar wallet
export const connectWallet = async () => {
  try {
    if (!window.ethereum) throw new Error("MetaMask no está instalado");
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    return accounts[0];
  } catch (error) {
    console.error("Error al conectar la wallet:", error);
    return null;
  }
};

// Crear un nuevo token
export const createToken = async (name, symbol, admin, usdcAddress) => {
  try {
    const factoryContract = await getFactoryContract();
    const tx = await factoryContract.createToken(name, symbol, admin, usdcAddress);
    await tx.wait(); // Espera a que se confirme la transacción
    return tx.hash; // Devuelve el hash de la transacción
  } catch (error) {
    console.error("Error al crear el token:", error);
    return null;
  }
};

// Obtener la lista de tokens creados
export const getCreatedTokens = async () => {
  try {
    const factoryContract = await getFactoryContract();
    return await factoryContract.getCreatedTokens();
  } catch (error) {
    console.error("Error al obtener los tokens creados:", error);
    return [];
  }
};
