const hre = require("hardhat");

async function main() {
  const Factory = await hre.ethers.getContractFactory("CPIFactory");
  const factory = await Factory.deploy();

  console.log("Factory deployed to:", factory.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
