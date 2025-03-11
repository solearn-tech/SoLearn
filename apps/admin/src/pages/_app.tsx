import React from 'react';
import { AppProps } from 'next/app';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { AdminLayout } from '../components/layout/AdminLayout';
import '../styles/globals.css';

// Default styles for wallet adapter
require('@solana/wallet-adapter-react-ui/styles.css');

function MyApp({ Component, pageProps, router }: AppProps) {
  // Set up Solana connection
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = clusterApiUrl(network);
  
  // Set up wallet adapters
  const wallets = [
    new PhantomWalletAdapter(),
  ];

  // Check if the current route is login
  const isLoginPage = router.pathname === '/login';

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {isLoginPage ? (
            <Component {...pageProps} />
          ) : (
            <AdminLayout>
              <Component {...pageProps} />
            </AdminLayout>
          )}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default MyApp; 