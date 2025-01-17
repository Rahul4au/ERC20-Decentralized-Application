import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  LocalAtm as LocalAtmIcon
} from '@mui/icons-material';
import { useWallet } from '../contexts/WalletContext';
import { useContract } from '../hooks/useContract';
import {
  TOKEN_A_ADDRESS,
  TOKEN_B_ADDRESS,
  LIQUIDITY_POOL_ADDRESS
} from '../utils/contractAddresses';
import TokenABI from '../utils/contractABIs/TokenA.json';
import TokenBABI from '../utils/contractABIs/TokenB.json';
import LiquidityPoolABI from '../utils/contractABIs/LiquidityPool.json';

const DashboardCard = ({ icon, title, value }) => (
  <Paper
    elevation={3}
    sx={{
      p: 3,
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      background: 'linear-gradient(145deg, #1e1e1e 0%, #2a2a2a 100%)'
    }}
  >
    {icon}
    <Box>
      <Typography variant="subtitle1" color="textSecondary">
        {title}
      </Typography>
      <Typography variant="h5" fontWeight="bold">
        {value}
      </Typography>
    </Box>
  </Paper>
);

const Dashboard = () => {
  const { address, provider } = useWallet();
  const [tokenABalance, setTokenABalance] = useState('0');
  const [tokenBBalance, setTokenBBalance] = useState('0');
  const [poolLiquidity, setPoolLiquidity] = useState('0');

  const tokenAContract = useContract(TOKEN_A_ADDRESS, TokenABI);
  const tokenBContract = useContract(TOKEN_B_ADDRESS, TokenBABI);
  const liquidityPoolContract = useContract(LIQUIDITY_POOL_ADDRESS, LiquidityPoolABI);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!address || !provider) return;

      try {
        const aBalance = await tokenAContract.balanceOf(address);
        const bBalance = await tokenBContract.balanceOf(address);
        const totalLiquidity = await liquidityPoolContract.totalLiquidity();

        setTokenABalance(aBalance.toString());
        setTokenBBalance(bBalance.toString());
        setPoolLiquidity(totalLiquidity.toString());
      } catch (error) {
        console.error("Dashboard data fetch error", error);
      }
    };

    fetchBalances();
  }, [address, provider, tokenAContract, tokenBContract, liquidityPoolContract]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <DashboardCard
          icon={<LocalAtmIcon fontSize="large" color="primary" />}
          title="Token A Balance"
          value={tokenABalance}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <DashboardCard
          icon={<LocalAtmIcon fontSize="large" color="secondary" />}
          title="Token B Balance"
          value={tokenBBalance}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <DashboardCard
          icon={<AccountBalanceIcon fontSize="large" color="primary" />}
          title="Total Pool Liquidity"
          value={poolLiquidity}
        />
      </Grid>
    </Grid>
  );
};

export default Dashboard;