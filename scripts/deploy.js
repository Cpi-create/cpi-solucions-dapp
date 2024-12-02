const { ethers } = require("hardhat");

async function main() {
    const name = "CPIFinancialToken"; // Nombre del token
    const symbol = "CPI"; // Símbolo del token
    const admin = "0xc29C9bd0BC978dFCAd34Be1AE66D8E785C152c55"; // Dirección del administrador
    const usdcToken = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"; // Dirección del contrato USDC en Polygon

    console.log("Deploying CPIFinancialToken...");
    const CPIFinancialToken = await ethers.getContractFactory("CPIFinancialToken");
    const token = await CPIFinancialToken.deploy(name, symbol, admin, usdcToken);

    console.log(`CPIFinancialToken deployed to: ${token.target}`);
}

main().catch((error) => {
    console.error("Error al desplegar el contrato:", error);
    process.exitCode = 1;
});
