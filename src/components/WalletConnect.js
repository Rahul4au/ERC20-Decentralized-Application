import React, { createContext, useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers';
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
      const ethersProvider = new ethers.providers.Web3Provider(instance);
      const signer = ethersProvider.getSigner();
      
      const userAddress = await signer.getAddress();
      const userBalance = await ethersProvider.getBalance(userAddress);
      
      setAddress(userAddress);
      setProvider(ethersProvider);
      setBalance(ethers.utils.formatEther(userBalance));
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