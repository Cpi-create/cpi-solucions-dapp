require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // Carga las variables de entorno desde el archivo .env

module.exports = {
    solidity: "0.8.27", // Versión de Solidity que usaremos
    networks: {
        polygon: {
            url: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`, // Usamos la clave correcta
            accounts: [`0x${process.env.PRIVATE_KEY}`], // Clave privada de Metamask (asegúrate de que esté bien configurada en el archivo .env)
        },
    },
    etherscan: {
        apiKey: process.env.POLYGONSCAN_API_KEY, // Clave para verificar contratos en Polygonscan
    },
};

// Esto imprime la URL del RPC para confirmar que las variables de entorno están cargando correctamente
console.log("RPC URL:", `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`);
