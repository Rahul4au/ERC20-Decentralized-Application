import React, { createContext, useState, useContext} from 'react';
import { BrowserProvider, formatEther } from 'ethers';
import Web3Modal from 'web3modal';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('0');
  const [provider, setProvider] = useState(null);

  const connectWallet = async () => {
    try {
      const web3Modal = new Web3Modal();
      const instance = await web3Modal.connect();
      const ethersProvider = new BrowserProvider(instance);
      const signer = await ethersProvider.getSigner();
      
      const userAddress = await signer.getAddress();
      const userBalance = await ethersProvider.getBalance(userAddress);
      
      setAddress(userAddress);
      setProvider(ethersProvider);
      setBalance(formatEther(userBalance));
    } catch (error) {
      console.error("Wallet connection failed", error);
    }
  };

  const disconnectWallet = () => {
    setAddress('');
    setProvider(null);
    setBalance('0');
  };

  return (
    <WalletContext.Provider value={{
      address,
      balance,
      provider,
      connectWallet,
      disconnectWallet
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);