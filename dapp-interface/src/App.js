import { useState } from 'react';
import connectBlockchain from './web3';

const App = () => {
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [initialSupply, setInitialSupply] = useState('');

  const createToken = async () => {
    const { contract } = await connectBlockchain();
    try {
      const tx = await contract.createToken(tokenName, tokenSymbol, initialSupply);
      await tx.wait();
      alert('Token creado exitosamente');
    } catch (error) {
      console.error('Error al crear el token:', error);
      alert('Hubo un error al crear el token');
    }
  };

  return (
    <div>
      <h1>Bienvenido a CPI Financial DApp!</h1>
      <div>
        <h2>Crear un nuevo token</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createToken();
          }}
        >
          <input
            type="text"
            placeholder="Nombre del token"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Símbolo del token"
            value={tokenSymbol}
            onChange={(e) => setTokenSymbol(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Suministro inicial"
            value={initialSupply}
            onChange={(e) => setInitialSupply(e.target.value)}
            required
          />
          <button type="submit">Crear Token</button>
        </form>
      </div>
    </div>
  );
};

export default App;
