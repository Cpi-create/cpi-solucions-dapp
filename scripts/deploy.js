// Importar ethers desde Hardhat
const { ethers } = require("hardhat");

async function main() {
    // Mostrar la URL de la RPC para depuración
    console.log("RPC URL:", process.env.ALCHEMY_API_KEY);

    // Definir el suministro inicial del token (1 millón de tokens con 18 decimales)
    let initialSupply;
    try {
        initialSupply = ethers.parseUnits("1000000", 18);
        console.log("Initial supply parsed successfully:", initialSupply.toString());
    } catch (error) {
        console.error("Error parsing initial supply:", error);
        throw error;
    }

    console.log("Deploying CPIFinancialToken...");
    const CPIFinancialToken = await ethers.getContractFactory("CPIFinancialToken");
    const token = await CPIFinancialToken.deploy(initialSupply);

    console.log("Awaiting deployment...");
    await token.waitForDeployment();

    console.log("CPIFinancialToken deployed to:", await token.getAddress());
}

// Manejo de errores en el script
main().catch((error) => {
    console.error("Error during deployment:", error);
    process.exitCode = 1;
});
