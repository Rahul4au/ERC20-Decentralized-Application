import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../contexts/WalletContext';

export const useContract = (address, abi) => {
  const { provider } = useWallet();
  const [contract, setContract] = useState(null);

  useEffect(() => {
    if (provider) {
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(address, abi, signer);
      setContract(contractInstance);
    }
  }, [provider, address, abi]);

  return contract;
};