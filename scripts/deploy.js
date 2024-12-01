const { ethers } = require("hardhat");

async function main() {
    // Mostrar la URL de la RPC para depuración
    console.log("RPC URL:", process.env.ALCHEMY_API_KEY);

    // Dirección del contrato USDC de Polygon
    const usdcAddress = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";

    // Suministro inicial del token (1 millón con 18 decimales)
    const initialSupply = ethers.parseUnits("1000000", 18);

    // Desplegar el contrato CPIFinancialToken
    console.log("Desplegando contrato CPIFinancialToken...");
    const CPIFinancialToken = await ethers.getContractFactory("CPIFinancialToken");
    const token = await CPIFinancialToken.deploy(initialSupply, usdcAddress);

    console.log("Esperando a que el despliegue se complete...");
    await token.waitForDeployment();

    // Dirección del contrato desplegado
    console.log("Contrato CPIFinancialToken desplegado en:", await token.getAddress());
}

main().catch((error) => {
    console.error("Error al desplegar el contrato:", error);
    process.exitCode = 1;
});
