import React from 'react';
import { 
  ThemeProvider, 
  CssBaseline, 
  Container, 
  Box 
} from '@mui/material';
import { WalletProvider } from './contexts/WalletContext';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import TokenSwap from './components/TokenSwap';
import LiquidityPool from './components/LiquidityPool';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import theme from './theme/theme';
import { motion } from 'framer-motion';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <WalletProvider>
        <CssBaseline />
        <Navbar />
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 4, 
              py: 4 
            }}>
              <Dashboard />
              <TokenSwap />
              <LiquidityPool />
            </Box>
          </motion.div>
        </Container>
        <ToastContainer 
          position="bottom-right"
          autoClose={3000}
          theme="dark"
        />
      </WalletProvider>
    </ThemeProvider>
  );
}

export default App;