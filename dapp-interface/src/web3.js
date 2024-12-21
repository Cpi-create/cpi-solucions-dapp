import { ethers } from 'ethers';

const contractAddress = "DIRECCION_DE_TU_CONTRATO"; // Reemplaza con la dirección de tu contrato
const contractABI = [
  // Copia y pega el ABI generado en el archivo "artifacts/contracts/CPIFinancialToken.json"
];

const connectBlockchain = async () => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      console.log('Conectado a la blockchain');
      return { provider, signer, contract };
    } catch (error) {
      console.error('Error al conectar con la blockchain:', error);
    }
  } else {
    console.error('Ethereum no está disponible en este navegador');
  }
};

export default connectBlockchain;
