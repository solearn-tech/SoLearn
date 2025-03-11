import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Image from 'next/image';

const Login: React.FC = () => {
  const { connected } = useWallet();
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard if wallet is connected
    if (connected) {
      router.push('/');
    }
  }, [connected, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <Image 
              src="/solearn_logo.png" 
              alt="SoLearn Admin" 
              width={120} 
              height={120} 
              className="mx-auto"
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            SoLearn Admin Portal
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Please connect your wallet to access the admin dashboard
          </p>
        </div>
        <div className="mt-8 flex justify-center">
          <WalletMultiButton />
        </div>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                Admin access only
              </span>
            </div>
          </div>
          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>This portal is restricted to authorized admin wallets only.</p>
            <p className="mt-2">Unauthorized access attempts will be logged.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 