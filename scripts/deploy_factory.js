const hre = require("hardhat");

async function main() {
    console.log("Iniciando el despliegue de CPIFinancialFactory...");

    // Obtener el contrato
    const CPIFinancialFactory = await hre.ethers.getContractFactory("CPIFinancialFactory");
    console.log("Factory obtenida correctamente...");

    // Desplegar el contrato con un límite de gas manual
    const factory = await CPIFinancialFactory.deploy({
        gasLimit: 6000000, // Ajustar según sea necesario
    });
    console.log("Transacción de despliegue enviada. Esperando confirmación...");

    // Esperar hasta que el contrato sea desplegado
    await factory.deployed();

    // Mostrar la dirección del contrato desplegado
    console.log("Factory desplegada en la dirección:", factory.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error al desplegar la factory:", error);
        process.exit(1);
    });
