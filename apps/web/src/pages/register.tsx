import Head from 'next/head';
import RegisterForm from '../components/auth/RegisterForm';
import { WalletContextProvider } from '../contexts/WalletContext';

export default function RegisterPage() {
  return (
    <WalletContextProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 sm:py-16 lg:py-24">
        <Head>
          <title>Create Account | SoLearn</title>
          <meta name="description" content="Join SoLearn to start learning blockchain skills and earning rewards." />
        </Head>

        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center">
            {/* Logo */}
            <div className="mb-8">
              <img src="/logo.svg" alt="SoLearn Logo" className="h-12" />
            </div>
            
            {/* Register Form */}
            <RegisterForm />
          </div>
        </div>
      </div>
    </WalletContextProvider>
  );
} 