const { providers } = require("ethers"); // Importamos correctamente el proveedor de ethers.js
require("dotenv").config(); // Cargar las variables del archivo .env

async function main() {
  try {
    // Configurar el proveedor usando ethers.providers
    const provider = new providers.JsonRpcProvider(
      `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
    );

    // Obtener el número de bloque actual en la red
    const blockNumber = await provider.getBlockNumber();
    console.log("Conexión exitosa. Bloque actual:", blockNumber);
  } catch (error) {
    console.error("Error de conexión:", error.message);
  }
}

main();
