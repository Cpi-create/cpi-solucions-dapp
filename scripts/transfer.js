const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const tokenAddress = "0x4fA7001B2a9809Da38d5Dedb3Ef53eBcc2Ab16ea"; // Dirección de tu token
  const recipient = "0xc29C9bd0BC978dFCAd34Be1AE66D8E785C152c55"; // Tu propia dirección
  const amount = hre.ethers.utils.parseUnits("1", 18); // 1 token con 18 decimales

  const tokenContract = await hre.ethers.getContractAt("ERC20", tokenAddress);

  console.log(`Transfiriendo ${amount.toString()} tokens a ${recipient}`);
  const tx = await tokenContract.transfer(recipient, amount);
  await tx.wait();

  console.log("Transacción completada:", tx.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error al transferir tokens:", error);
    process.exit(1);
  });
