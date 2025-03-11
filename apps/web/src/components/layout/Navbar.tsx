import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiMenu, FiX, FiHome, FiBook, FiAward, FiUser, FiDollarSign } from 'react-icons/fi';
import { useWallet } from '../../contexts/WalletContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const { connected, walletAddress, connectWallet, disconnectWallet } = useWallet();

  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [router.pathname]);

  // Navigation items
  const navItems = [
    { name: 'Home', path: '/', icon: <FiHome className="mr-2" /> },
    { name: 'Courses', path: '/courses', icon: <FiBook className="mr-2" /> },
    { name: 'Dashboard', path: '/dashboard', icon: <FiUser className="mr-2" /> },
    { name: 'Achievements', path: '/achievements', icon: <FiAward className="mr-2" /> },
    { name: 'Rewards', path: '/rewards', icon: <FiDollarSign className="mr-2" /> },
  ];

  // Format wallet address for display
  const formatWalletAddress = (address: string) => {
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white dark:bg-gray-900 shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" legacyBehavior>
            <a className="flex items-center">
              <span className="text-xl font-bold text-primary-600 dark:text-primary-400">Solearn</span>
            </a>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path} legacyBehavior>
                <a 
                  className={`flex items-center text-sm font-medium transition-colors ${
                    router.pathname === item.path
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </a>
              </Link>
            ))}
          </div>

          {/* Wallet Connection and Theme Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            
            {connected ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {formatWalletAddress(walletAddress || '')}
                </span>
                <button
                  onClick={disconnectWallet}
                  className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="px-4 py-2 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                Connect Wallet
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path} legacyBehavior>
                  <a 
                    className={`flex items-center py-2 text-sm font-medium ${
                      router.pathname === item.path
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </a>
                </Link>
              ))}

              {/* Mobile Wallet Connection */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                {connected ? (
                  <div className="flex flex-col space-y-2">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Connected: {formatWalletAddress(walletAddress || '')}
                    </span>
                    <button
                      onClick={disconnectWallet}
                      className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={connectWallet}
                    className="w-full px-4 py-2 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                  >
                    Connect Wallet
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 