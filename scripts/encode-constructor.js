const { ethers } = require("ethers");

async function main() {
    const abiCoder = new ethers.utils.AbiCoder();

    const encoded = abiCoder.encode(
        ["string", "string", "address", "address", "uint256"],
        [
            "CPIToken", 
            "CPI", 
            "0xc29C9bd0BC978dFCAd34Be1AE66D8E785C152c55", 
            "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", 
            "1000000"
        ]
    );

    console.log("Constructor arguments encoded:", encoded);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
