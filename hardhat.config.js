require("@nomicfoundation/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
  paths: {
    sources: "./contracts", // Carpeta donde están los contratos
    tests: "./test",        // Carpeta donde están los tests
    cache: "./cache",       // Carpeta para caché
    artifacts: "./artifacts" // Carpeta para artefactos generados
  },
  solidity: {
    version: "0.8.18", // Versión del compilador
    settings: {
      optimizer: {
        enabled: true, // Activa la optimización
        runs: 200,     // Número de ejecuciones óptimas para Mainnet
      },
    },
  },
  networks: {
    polygon: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`, // URL de Alchemy
      accounts: [`0x${process.env.PRIVATE_KEY}`], // Clave privada desde .env
    },
    hardhat: {
      chainId: 1337, // Configuración local por defecto
    },
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY, // Clave API de Polygonscan
  },
};
