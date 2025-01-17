import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Box,
  CircularProgress 
} from '@mui/material';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  parseUnits
} from 'ethers';
import { useWallet } from '../contexts/WalletContext';
import { useContract } from '../hooks/useContract';
import { TOKEN_A_ADDRESS, 
        TOKEN_B_ADDRESS, 
        LIQUIDITY_POOL_ADDRESS } from '../utils/contractAddresses';
import TokenABI from '../utils/contractABIs/TokenA.json';
import TokenBABI from '../utils/contractABIs/TokenB.json';
import LiquidityPoolABI from '../utils/contractABIs/LiquidityPool.json';

const LiquidityPool = () => {
  const { address, provider } = useWallet();
  const [amountA, setAmountA] = useState('');
  const [amountB, setAmountB] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const tokenAContract = useContract(TOKEN_A_ADDRESS, TokenABI);
  const tokenBContract = useContract(TOKEN_B_ADDRESS, TokenBABI);
  const liquidityPoolContract = useContract(LIQUIDITY_POOL_ADDRESS, LiquidityPoolABI);

  const handleAddLiquidity = async () => {
    if (!address || !provider) {
        toast.error('Please connect your wallet first');
        return;
      }
  
      // Validate input amounts
      if (!amountA || !amountB) {
        toast.error('Please enter amounts for both tokens');
        return;
      }
  
      // Convert input to wei
      let amountAWei, amountBWei;
      try {
        amountAWei = ethers.parseUnits(amountA, 18);
        amountBWei = ethers.parseUnits(amountB, 18);
      } catch (error) {
        toast.error('Invalid token amounts');
        return;
      }
  
      setIsLoading(true);
  
      try {
        // Step 1: Approve Token A spending
        const approveTokenATx = await tokenAContract.approve(
          LIQUIDITY_POOL_ADDRESS, 
          amountAWei
        );
        await approveTokenATx.wait();
        toast.info('Token A approval successful');
  
        // Step 2: Approve Token B spending
        const approveTokenBTx = await tokenBContract.approve(
          LIQUIDITY_POOL_ADDRESS, 
          amountBWei
        );
        await approveTokenBTx.wait();
        toast.info('Token B approval successful');
  
        // Step 3: Add Liquidity
        const addLiquidityTx = await liquidityPoolContract.addLiquidity(
          amountAWei, 
          amountBWei
        );
        
        // Wait for transaction confirmation
        const receipt = await addLiquidityTx.wait();
  
        // Success notification
        toast.success('Liquidity added successfully!', {
          details: `Tx Hash: ${receipt.transactionHash}`
        });
  
        // Reset input fields
        setAmountA('');
        setAmountB('');
      } catch (error) {
        // Detailed error handling
        console.error("Add liquidity error", error);
        
        if (error.code === 4001) {
          toast.error('Transaction rejected by user');
        } else if (error.message.includes('insufficient funds')) {
          toast.error('Insufficient funds for transaction');
        } else if (error.message.includes('allowance')) {
          toast.error('Insufficient token allowance');
        } else {
          toast.error('Failed to add liquidity. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <Card elevation={3} sx={{ p: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Add Liquidity
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField 
              label="Amount of Token A" 
              variant="outlined" 
              type="number"
              value={amountA} 
              onChange={(e) => setAmountA(e.target.value)}
              disabled={isLoading}
              InputProps={{
                inputProps: { min: 0 }
              }}
            />
            <TextField 
              label="Amount of Token B" 
              variant="outlined" 
              type="number"
              value={amountB} 
              onChange={(e) => setAmountB(e.target.value)}
              disabled={isLoading}
              InputProps={{
                inputProps: { min: 0 }
              }}
            />
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleAddLiquidity}
              disabled={isLoading || !address}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
            >
              {isLoading ? 'Adding Liquidity...' : 'Add Liquidity'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  };
  
  export default LiquidityPool;