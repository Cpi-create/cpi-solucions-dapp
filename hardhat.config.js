require("@nomicfoundation/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
  paths: {
    sources: "./contracts", // Carpeta donde están los contratos
  },
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true, // Activar optimización
        runs: 200,     // Configuración estándar para Mainnet
      },
    },
  },
  networks: {
    polygon: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      gasPrice: 50000000000, // 50 Gwei
    },
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY,
  },
};
