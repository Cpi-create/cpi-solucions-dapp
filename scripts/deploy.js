const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    const CPIFinancialToken = await hre.ethers.getContractFactory("CPIFinancialToken");
    const token = await CPIFinancialToken.deploy(
        "MyToken",      // Nombre del token
        "MTK",          // Símbolo del token
        deployer.address,  // Dirección del administrador
        "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // Dirección de USDC en Polygon
        1000000          // Suministro inicial
    );

    await token.deployed();

    console.log("CPIFinancialToken deployed to:", token.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
