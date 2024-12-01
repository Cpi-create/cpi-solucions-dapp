// Importar ethers desde Hardhat
const { ethers } = require("hardhat");

async function main() {
    console.log("Deploying CPIFinancialToken...");

    // Dirección USDC y del propietario inicial (tú)
    const usdcAddress = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
    const initialOwner = "0xc29C9bd0BC978dFCAd34Be1AE66D8E785C152c55";

    // Obtener el contrato y desplegarlo
    const CPIFinancialToken = await ethers.getContractFactory("CPIFinancialToken");
    const token = await CPIFinancialToken.deploy(usdcAddress, initialOwner);

    console.log("Awaiting deployment...");
    await token.deployed();

    console.log("CPIFinancialToken deployed to:", token.address);
}

// Manejo de errores en el script
main().catch((error) => {
    console.error("Error al desplegar el contrato:", error);
    process.exitCode = 1;
});
