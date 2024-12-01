const { ethers } = require("hardhat");

async function main() {
    const adminAddress = "0xc29C9bd0BC978dFCAd34Be1AE66D8E785C152c55"; // Dirección de tu wallet
    const usdcAddress = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"; // Dirección del contrato USDC en Polygon

    console.log("Deploying CPIFinancialToken...");
    const CPIFinancialToken = await ethers.getContractFactory("CPIFinancialToken");
    const token = await CPIFinancialToken.deploy(adminAddress, usdcAddress);

    console.log("Awaiting deployment...");
    await token.deployed();

    console.log("CPIFinancialToken deployed to:", token.address);
}

main().catch((error) => {
    console.error("Error al desplegar el contrato:", error);
    process.exitCode = 1;
});
