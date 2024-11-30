import { connectWallet, getTotalSupply, getTokenBalance } from "./web3";

async function testWeb3Functions() {
  // Intentar conectar la billetera
  const account = await connectWallet();
  if (!account) {
    console.error("No se pudo conectar la billetera.");
    return;
  }

  console.log("Cuenta conectada:", account);

  // Obtener balance de tokens
  const balance = await getTokenBalance(account);
  console.log(`Balance de la cuenta (${account}):`, balance ? balance.toString() : "Error obteniendo balance");

  // Obtener suministro total de tokens
  const totalSupply = await getTotalSupply();
  console.log("Suministro total de tokens:", totalSupply ? totalSupply.toString() : "Error obteniendo suministro total");
}

testWeb3Functions();
