// Importar ethers desde Hardhat
const { ethers } = require("hardhat");

async function main() {
    // RPC para depuración
    console.log("RPC URL:", process.env.ALCHEMY_API_KEY);

    // Dirección del contrato USDC
    const usdcAddress = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"; // Dirección correcta de USDC en Polygon
    
    // Dirección del propietario/administrador del contrato
    const adminAddress = "0xc29C9bd0BC978dFCAd34Be1AE66D8E785C152c55"; // Tu dirección

    // Crear la instancia del contrato
    console.log("Deploying CPIFinancialToken...");
    const CPIFinancialToken = await ethers.getContractFactory("CPIFinancialToken");
    const token = await CPIFinancialToken.deploy(usdcAddress, adminAddress);

    console.log("Awaiting deployment...");
    await token.deployed();

    // Imprimir la dirección del contrato desplegado
    console.log("CPIFinancialToken deployed to:", token.address);
}

// Ejecutar el script de despliegue
main().catch((error) => {
    console.error("Error al desplegar el contrato:", error);
    process.exitCode = 1;
});
