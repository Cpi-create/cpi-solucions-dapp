const main = async () => {
    const CPIFinancialToken = await ethers.getContractFactory("CPIFinancialToken");

    // Parámetros para el constructor
    const name = "CPIFinancialToken";
    const symbol = "CPI";
    const adminWallet = "0xc29C9bd0BC978dFCAd34Be1AE66D8E785C152c55"; // Reemplaza con tu dirección
    const usdcTokenAddress = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"; // Dirección de USDC en Polygon

    console.log("Deploying CPIFinancialToken...");
    const token = await CPIFinancialToken.deploy(name, symbol, adminWallet, usdcTokenAddress);
    await token.deployed();

    console.log("CPIFinancialToken deployed to:", token.address);
};

main().catch((error) => {
    console.error("Error al desplegar el contrato:", error);
    process.exitCode = 1;
});
