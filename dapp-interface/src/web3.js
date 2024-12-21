import { ethers } from 'ethers';

const connectBlockchain = async () => {
  if (window.ethereum) {
    try {
      // Solicitar acceso a la wallet del usuario
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Crear un proveedor para interactuar con la blockchain
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // Obtener el signer (usuario conectado)
      const signer = provider.getSigner();

      console.log('Conectado a la blockchain');
      return { provider, signer };
    } catch (error) {
      console.error('Error al conectar con la blockchain:', error);
    }
  } else {
    console.error('Ethereum no está disponible en este navegador');
  }
};

export default connectBlockchain;
