require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(
        `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    );

    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const balance = await wallet.getBalance();
    console.log(`Connected to Polygon!`);
    console.log(`Address: ${wallet.address}`);
    console.log(`Balance: ${ethers.utils.formatEther(balance)} MATIC`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
