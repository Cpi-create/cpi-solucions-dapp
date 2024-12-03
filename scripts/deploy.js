const { ethers } = require("hardhat");

async function main() {
    const usdcAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"; // Dirección del contrato USDC en Polygon

    console.log("Deploying CPIFinancialFactory...");
    const CPIFinancialFactory = await ethers.getContractFactory("CPIFinancialFactory");
    const factory = await CPIFinancialFactory.deploy();

    console.log("Awaiting deployment...");
    await factory.waitForDeployment();

    console.log("CPIFinancialFactory deployed to:", factory.target);
}

main().catch((error) => {
    console.error("Error al desplegar el contrato:", error);
    process.exitCode = 1;
});
