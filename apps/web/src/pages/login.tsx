import Head from 'next/head';
import LoginForm from '../components/auth/LoginForm';
import { WalletContextProvider } from '../contexts/WalletContext';

export default function LoginPage() {
  return (
    <WalletContextProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 sm:py-16 lg:py-24">
        <Head>
          <title>Login | SoLearn</title>
          <meta name="description" content="Sign in to your SoLearn account to continue your learning journey." />
        </Head>

        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center">
            {/* Logo */}
            <div className="mb-8">
              <img src="/logo.svg" alt="SoLearn Logo" className="h-12" />
            </div>
            
            {/* Login Form */}
            <LoginForm />
          </div>
        </div>
      </div>
    </WalletContextProvider>
  );
} 