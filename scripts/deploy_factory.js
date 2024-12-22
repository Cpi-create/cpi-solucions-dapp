const hre = require("hardhat");

async function main() {
    // Obtenemos el contrato Factory
    const CPIFinancialFactory = await hre.ethers.getContractFactory("CPIFinancialFactory");

    // Desplegamos el contrato
    const factory = await CPIFinancialFactory.deploy({
      gasPrice: hre.ethers.utils.parseUnits('50', 'gwei') // Ajusta el precio del gas si es necesario
  });
  

    await factory.deployed();

    console.log("Factory desplegada en la dirección:", factory.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error al desplegar el contrato Factory:", error);
        process.exit(1);
    });
