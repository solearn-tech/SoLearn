import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { WalletContextProvider } from '../../contexts/WalletContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <WalletContextProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-16">{children}</main>
        <Footer />
      </div>
    </WalletContextProvider>
  );
};

export default Layout; 