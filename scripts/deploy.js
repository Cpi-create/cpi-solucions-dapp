// Importar ethers desde Hardhat
const { ethers } = require("hardhat");

async function main() {
    console.log("Deploying CPIFinancialToken...");

    // Dirección de USDC y del administrador
    const adminAddress = "0xc29C9bd0BC978dFCAd34Be1AE66D8E785C152c55";
    const usdcAddress = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";

    // Definir el suministro inicial del token (1 millón de tokens con 18 decimales)
    const initialSupply = ethers.parseUnits("1000000", 18);

    try {
        // Obtener el contrato para desplegar
        const CPIFinancialToken = await ethers.getContractFactory("CPIFinancialToken");

        // Desplegar el contrato con los parámetros requeridos
        const token = await CPIFinancialToken.deploy(initialSupply, adminAddress, usdcAddress);

        console.log("Awaiting deployment...");
        await token.waitForDeployment();

        // Obtener y mostrar la dirección del contrato desplegado
        console.log("CPIFinancialToken deployed to:", await token.getAddress());
    } catch (error) {
        console.error("Error al desplegar el contrato:", error);
    }
}

// Manejo de errores
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
