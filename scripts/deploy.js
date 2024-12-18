const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const accountBalance = await deployer.getBalance();
  console.log("Account balance:", hre.ethers.utils.formatEther(accountBalance), "MATIC");

  // Parámetros del nuevo token
  const name = "EmpresaUnoToken"; // Nombre del token
  const symbol = "EMP1"; // Símbolo del token
  const admin = "0xc29C9bd0BC978dFCAd34Be1AE66D8E785C152c55"; // Tu dirección de Metamask
  const usdcToken = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"; // Dirección del contrato de USDC en Polygon
  const initialSupply = hre.ethers.utils.parseUnits("1000", 18); // 1000 tokens con 18 decimales

  // Compila y despliega el contrato
  const CPIFinancialToken = await hre.ethers.getContractFactory("CPIFinancialToken");
  const token = await CPIFinancialToken.deploy(name, symbol, admin, usdcToken, initialSupply);

  console.log(`Token "${name}" deployed to:`, token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error al desplegar el contrato:", error);
    process.exit(1);
  });
