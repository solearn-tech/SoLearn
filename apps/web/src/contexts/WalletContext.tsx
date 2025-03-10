import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// WalletContext type definition
interface WalletContextState {
  connected: boolean;
  walletAddress: string | null;
  connecting: boolean;
  connectWallet: () => Promise<boolean>;
  disconnectWallet: () => void;
  balance: number;
  learningTokens: number;
  error: string | null;
}

// Provider props type
interface WalletContextProviderProps {
  children: ReactNode;
}

// Create Context default value
const defaultContextValue: WalletContextState = {
  connected: false,
  walletAddress: null,
  connecting: false,
  connectWallet: async () => false,
  disconnectWallet: () => {},
  balance: 0,
  learningTokens: 0,
  error: null,
};

// Create Context
const WalletContext = createContext<WalletContextState>(defaultContextValue);

// Custom Hook for accessing WalletContext in components
export const useWallet = () => useContext(WalletContext);

// WalletContext provider component
export const WalletContextProvider = ({ children }: WalletContextProviderProps) => {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [balance, setBalance] = useState(0);
  const [learningTokens, setLearningTokens] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Check if wallet is already connected
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Here we would check for existing connections
        // This is a mock functionality, actual implementation would connect to Solana wallet
        console.log('Checking wallet connection status...');
        
        // Read saved wallet address from local storage
        const savedAddress = localStorage.getItem('walletAddress');
        if (savedAddress) {
          setWalletAddress(savedAddress);
          setConnected(true);
          // Mock balance retrieval
          setBalance(5.23);
          setLearningTokens(120);
        }
      } catch (err) {
        console.error('Wallet connection check failed', err);
        setError('Error connecting wallet');
      }
    };

    checkConnection();
  }, []);

  // Connect wallet function
  const connectWallet = async (): Promise<boolean> => {
    try {
      setConnecting(true);
      setError(null);
      
      // This is mock logic for connecting to Solana wallet, actual implementation would use wallet-adapter-react or similar
      console.log('Connecting to wallet...');
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful wallet connection
      const mockAddress = 'ASD9FHW9eh93hASDFASDFewf9weFAsdf';
      setWalletAddress(mockAddress);
      setConnected(true);
      
      // Save to local storage
      localStorage.setItem('walletAddress', mockAddress);
      
      // Mock balance retrieval
      setBalance(5.23);
      setLearningTokens(120);
      
      setConnecting(false);
      return true;
    } catch (err) {
      console.error('Wallet connection failed', err);
      setError('Error connecting wallet');
      setConnecting(false);
      return false;
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setConnected(false);
    setWalletAddress(null);
    setBalance(0);
    setLearningTokens(0);
    // Remove from local storage
    localStorage.removeItem('walletAddress');
  };

  // Context value
  const value = {
    connected,
    walletAddress,
    connecting,
    connectWallet,
    disconnectWallet,
    balance,
    learningTokens,
    error,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export default WalletContext; 