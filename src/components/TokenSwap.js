import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Box 
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { useWallet } from '../contexts/WalletContext';
import { useContract } from '../hooks/useContract';
import { TOKEN_A_ADDRESS, TOKEN_B_ADDRESS, LIQUIDITY_POOL_ADDRESS } from '../utils/contractAddresses';
import TokenABI from '../utils/contractABIs/TokenA.json';
import TokenBABI from '../utils/contractABIs/TokenB.json';
import LiquidityPoolABI from '../utils/contractABIs/LiquidityPool.json';

const TokenSwap = () => {
  const { address, provider } = useWallet();
  const [amountA, setAmountA] = useState('');
  const [amountB, setAmountB] = useState('');

  const tokenAContract = useContract(TOKEN_A_ADDRESS, TokenABI);
  const tokenBContract = useContract(TOKEN_B_ADDRESS, TokenBABI);
  const liquidityPoolContract = useContract(LIQUIDITY_POOL_ADDRESS, LiquidityPoolABI);

  const handleSwap = async () => {
    if (!address || !provider) return;

    try {
      // Implement swap logic here
      // Example: await liquidityPoolContract.swap(amountA, amountB);
      console.log(`Swapping ${amountA} Token A for ${amountB} Token B`);
    } catch (error) {
      console.error("Swap error", error);
    }
  };

  return (
    <Card elevation={3} sx={{ p: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Token Swap
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField 
            label="Amount of Token A" 
            variant="outlined" 
            value={amountA} 
            onChange={(e) => setAmountA(e.target.value)} 
          />
          <TextField 
            label="Amount of Token B" 
            variant="outlined" 
            value={amountB} 
            onChange={(e) => setAmountB(e.target.value)} 
          />
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<SwapHorizIcon />} 
            onClick={handleSwap}
          >
            Swap
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TokenSwap;