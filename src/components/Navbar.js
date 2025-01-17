import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box 
} from '@mui/material';
import WalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useWallet } from '../contexts/WalletContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { address, connectWallet, disconnectWallet } = useWallet();

  const formatAddress = (addr) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ flexGrow: 1 }}
        >
          Liquidity Pool DApp
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {address ? (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
            >
              <Button 
                variant="outlined" 
                color="primary" 
                startIcon={<WalletIcon />}
              >
                {formatAddress(address)}
              </Button>
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={disconnectWallet}
                sx={{ ml: 2 }}
              >
                Disconnect
              </Button>
            </motion.div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="contained" 
                color="primary" 
                onClick={connectWallet}
                startIcon={<WalletIcon />}
            >
                Connect Wallet
              </Button>
            </motion.div>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;