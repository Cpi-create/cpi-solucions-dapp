const hre = require("hardhat");

async function main() {
    console.log("Iniciando el despliegue de CPIFinancialFactory...");

    const CPIFinancialFactory = await hre.ethers.getContractFactory("CPIFinancialFactory");
    console.log("Factory obtenida correctamente...");

    const factory = await CPIFinancialFactory.deploy();
    console.log("Transacción de despliegue enviada...");

    await factory.deployed();
    console.log("Factory desplegada en la dirección:", factory.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error al desplegar la factory:", error);
        process.exit(1);
    });
