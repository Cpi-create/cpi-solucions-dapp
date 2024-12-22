const { ethers } = require("hardhat");

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(
        `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    );

    const blockNumber = await provider.getBlockNumber();
    console.log("Conectado a Polygon. Bloque actual:", blockNumber);
}

main().catch((error) => {
    console.error("Error al conectar con Polygon:", error);
    process.exit(1);
});
