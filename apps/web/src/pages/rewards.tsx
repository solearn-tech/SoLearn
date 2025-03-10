import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { FiDollarSign, FiArrowUp, FiArrowDown, FiClock, FiAward, FiBookOpen, FiUsers } from 'react-icons/fi';
import { WalletContextProvider, useWallet } from '../contexts/WalletContext';

// Transaction types
const TRANSACTION_TYPES = {
  COURSE_COMPLETION: 'course_completion',
  ACHIEVEMENT: 'achievement',
  REFERRAL: 'referral',
  COMMUNITY: 'community',
  STAKING_REWARD: 'staking_reward',
  WITHDRAWAL: 'withdrawal',
};

// Mock transaction data
const mockTransactions = [
  {
    id: 'tx1',
    type: TRANSACTION_TYPES.COURSE_COMPLETION,
    title: 'Completed "Blockchain Fundamentals"',
    amount: 50,
    timestamp: '2023-06-10T14:30:00Z',
    status: 'confirmed',
    txHash: '5UBK...j7Yt',
  },
  {
    id: 'tx2',
    type: TRANSACTION_TYPES.ACHIEVEMENT,
    title: 'Earned "Consistent Scholar" achievement',
    amount: 25,
    timestamp: '2023-06-01T11:10:00Z',
    status: 'confirmed',
    txHash: '3xRF...p9Qz',
  },
  {
    id: 'tx3',
    type: TRANSACTION_TYPES.REFERRAL,
    title: 'Referral bonus: John Smith joined',
    amount: 15,
    timestamp: '2023-05-28T09:45:00Z',
    status: 'confirmed',
    txHash: '7mNP...k2Wv',
  },
  {
    id: 'tx4',
    type: TRANSACTION_TYPES.COMMUNITY,
    title: 'Community contribution reward',
    amount: 10,
    timestamp: '2023-05-25T16:20:00Z',
    status: 'confirmed',
    txHash: '9sLK...f3Rt',
  },
  {
    id: 'tx5',
    type: TRANSACTION_TYPES.STAKING_REWARD,
    title: 'Staking reward',
    amount: 5,
    timestamp: '2023-05-20T00:00:00Z',
    status: 'confirmed',
    txHash: '2pQM...h8Jd',
  },
  {
    id: 'tx6',
    type: TRANSACTION_TYPES.WITHDRAWAL,
    title: 'Withdrawal to wallet',
    amount: -75,
    timestamp: '2023-05-15T10:30:00Z',
    status: 'confirmed',
    txHash: '6tYU...g4Kf',
  },
];

// Rewards page component
const RewardsPage = () => {
  const { connected, walletAddress, balance, learningTokens } = useWallet();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [stats, setStats] = useState({
    totalEarned: 0,
    totalWithdrawn: 0,
    availableBalance: 0,
  });

  // Load transactions on component mount
  useEffect(() => {
    // In a real application, these would be API calls
    setTransactions(mockTransactions);
    setFilteredTransactions(mockTransactions);

    // Calculate stats
    const totalEarned = mockTransactions
      .filter(tx => tx.amount > 0)
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    const totalWithdrawn = Math.abs(
      mockTransactions
        .filter(tx => tx.amount < 0)
        .reduce((sum, tx) => sum + tx.amount, 0)
    );

    setStats({
      totalEarned,
      totalWithdrawn,
      availableBalance: totalEarned - totalWithdrawn,
    });
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...transactions];
    
    // Apply filter
    if (filter !== 'all') {
      result = result.filter(tx => tx.type === filter);
    }
    
    // Apply sorting
    if (sortOrder === 'newest') {
      result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } else if (sortOrder === 'oldest') {
      result.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    } else if (sortOrder === 'highest') {
      result.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
    } else if (sortOrder === 'lowest') {
      result.sort((a, b) => Math.abs(a.amount) - Math.abs(b.amount));
    }
    
    setFilteredTransactions(result);
  }, [transactions, filter, sortOrder]);

  // Format date to readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get transaction icon based on type
  const getTransactionIcon = (type) => {
    switch (type) {
      case TRANSACTION_TYPES.COURSE_COMPLETION:
        return <FiBookOpen className="text-green-500" />;
      case TRANSACTION_TYPES.ACHIEVEMENT:
        return <FiAward className="text-purple-500" />;
      case TRANSACTION_TYPES.REFERRAL:
        return <FiUsers className="text-blue-500" />;
      case TRANSACTION_TYPES.COMMUNITY:
        return <FiUsers className="text-yellow-500" />;
      case TRANSACTION_TYPES.STAKING_REWARD:
        return <FiDollarSign className="text-green-500" />;
      case TRANSACTION_TYPES.WITHDRAWAL:
        return <FiArrowUp className="text-red-500" />;
      default:
        return <FiClock className="text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>Rewards | SoLearn</title>
        <meta name="description" content="View your token rewards and transaction history" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl shadow-lg p-6 mb-8 text-white">
          <h1 className="text-2xl font-bold mb-2">Your Rewards</h1>
          <p className="mb-6">Track your $LEARN token earnings and transactions</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center">
                <FiDollarSign className="text-2xl mr-3" />
                <div>
                  <p className="text-sm opacity-80">Available Balance</p>
                  <p className="text-xl font-semibold">{stats.availableBalance} $LEARN</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center">
                <FiArrowDown className="text-2xl mr-3" />
                <div>
                  <p className="text-sm opacity-80">Total Earned</p>
                  <p className="text-xl font-semibold">{stats.totalEarned} $LEARN</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center">
                <FiArrowUp className="text-2xl mr-3" />
                <div>
                  <p className="text-sm opacity-80">Total Withdrawn</p>
                  <p className="text-xl font-semibold">{stats.totalWithdrawn} $LEARN</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <button className="bg-white text-primary-600 hover:bg-white/90 px-4 py-2 rounded-lg font-medium transition-colors">
              Withdraw Tokens
            </button>
          </div>
        </div>

        {/* Transaction history */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 md:mb-0">
              Transaction History
            </h2>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
              {/* Filter dropdown */}
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200"
              >
                <option value="all">All Transactions</option>
                <option value={TRANSACTION_TYPES.COURSE_COMPLETION}>Course Completions</option>
                <option value={TRANSACTION_TYPES.ACHIEVEMENT}>Achievements</option>
                <option value={TRANSACTION_TYPES.REFERRAL}>Referrals</option>
                <option value={TRANSACTION_TYPES.COMMUNITY}>Community Rewards</option>
                <option value={TRANSACTION_TYPES.STAKING_REWARD}>Staking Rewards</option>
                <option value={TRANSACTION_TYPES.WITHDRAWAL}>Withdrawals</option>
              </select>
              
              {/* Sort dropdown */}
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Amount</option>
                <option value="lowest">Lowest Amount</option>
              </select>
            </div>
          </div>
          
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No transactions found matching your filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Transaction
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                            {getTransactionIcon(tx.type)}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {tx.title}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <span className={`text-sm font-medium ${
                          tx.amount > 0 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {tx.amount > 0 ? '+' : ''}{tx.amount} $LEARN
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(tx.timestamp)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                        <a 
                          href={`https://explorer.solana.com/tx/${tx.txHash}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary-600 dark:text-primary-400 hover:underline"
                        >
                          {tx.txHash}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Wrap the rewards page with the wallet context provider
export default function Rewards() {
  return (
    <WalletContextProvider>
      <RewardsPage />
    </WalletContextProvider>
  );
} 