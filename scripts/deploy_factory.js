const hre = require("hardhat");

async function main() {
    const CPIFinancialFactory = await hre.ethers.getContractFactory("CPIFinancialFactory");
    const factory = await CPIFinancialFactory.deploy();

    await factory.deployed();

    console.log("Factory deployed to:", factory.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
