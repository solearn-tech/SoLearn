import React, { useState, useEffect } from 'react';
import { 
  FiDollarSign, 
  FiPieChart, 
  FiArrowUp, 
  FiArrowDown, 
  FiActivity,
  FiDownload,
  FiCalendar,
  FiClock,
  FiPlus,
  FiSend,
  FiUsers,
  FiLock
} from 'react-icons/fi';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

// Token distribution data
const TOKEN_DISTRIBUTION = {
  labels: ['Learning Rewards', 'Team & Advisors', 'Ecosystem Fund', 'Liquidity', 'Partners'],
  datasets: [{
    data: [300, 250, 200, 50, 50],
    backgroundColor: [
      'rgba(79, 70, 229, 0.8)',
      'rgba(59, 130, 246, 0.8)',
      'rgba(16, 185, 129, 0.8)',
      'rgba(245, 158, 11, 0.8)',
      'rgba(239, 68, 68, 0.8)',
    ],
    borderWidth: 1,
  }]
};

// Token price history
const TOKEN_PRICE_HISTORY = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
  datasets: [{
    label: 'LEARN Token Price (USD)',
    data: [0.012, 0.014, 0.018, 0.015, 0.022, 0.025, 0.021, 0.028],
    borderColor: 'rgb(79, 70, 229)',
    backgroundColor: 'rgba(79, 70, 229, 0.5)',
    tension: 0.3,
  }]
};

// Mock transaction data
const MOCK_TRANSACTIONS = [
  {
    id: '1',
    type: 'Reward',
    recipient: 'Alice Johnson',
    recipientWallet: '8YLKot3...7Eaa3',
    amount: 150,
    timestamp: '2023-08-15T14:32:00Z',
    status: 'Confirmed',
    txHash: '5PJ2UxRf...KgA2',
    notes: 'Course completion reward'
  },
  {
    id: '2',
    type: 'Transfer',
    recipient: 'Ecosystem Fund',
    recipientWallet: 'Gn7S4LGs...VNaB',
    amount: 10000,
    timestamp: '2023-08-10T09:15:00Z',
    status: 'Confirmed',
    txHash: 'j9HnMpK2...Y4Ws',
    notes: 'Monthly allocation'
  },
  {
    id: '3',
    type: 'Reward',
    recipient: 'Bob Smith',
    recipientWallet: 'F8c52KuQ...8f6u',
    amount: 75,
    timestamp: '2023-08-14T18:45:00Z',
    status: 'Confirmed',
    txHash: 'RtYh62Nj...L4Px',
    notes: 'Quiz completion reward'
  },
  {
    id: '4',
    type: 'Liquidity',
    recipient: 'DEX Pool',
    recipientWallet: 'D7Qk5xVv...8AFd',
    amount: 5000,
    timestamp: '2023-08-05T11:22:00Z',
    status: 'Confirmed',
    txHash: '9pLoQsR4...U7Bz',
    notes: 'Liquidity provision'
  },
  {
    id: '5',
    type: 'Vesting',
    recipient: 'Team Allocation',
    recipientWallet: 'HGbaK9EZ...HP4L',
    amount: 12500,
    timestamp: '2023-08-01T00:00:00Z',
    status: 'Confirmed',
    txHash: 'Kw4XzPt7...C9An',
    notes: 'Monthly team token unlock'
  },
  {
    id: '6',
    type: 'Reward',
    recipient: 'Carol Davis',
    recipientWallet: 'AQYC1DKd...qBHy',
    amount: 350,
    timestamp: '2023-08-12T15:10:00Z',
    status: 'Confirmed',
    txHash: 'Z7YnJxL2...Dv5H',
    notes: 'Achievement reward'
  },
  {
    id: '7',
    type: 'Manual',
    recipient: 'Dave Wilson',
    recipientWallet: 'B9rJKnWE...tVzs',
    amount: 200,
    timestamp: '2023-08-14T10:33:00Z',
    status: 'Pending',
    txHash: 'N/A',
    notes: 'Content creator reward'
  }
];

// Token metrics
const TOKEN_METRICS = [
  { title: 'Total Supply', value: '1,000,000,000', change: null, icon: FiDollarSign, color: 'indigo' },
  { title: 'Circulating Supply', value: '285,450,000', change: 2.4, icon: FiActivity, color: 'blue' },
  { title: 'Current Price', value: '$0.028', change: 5.7, icon: FiArrowUp, color: 'green' },
  { title: 'Market Cap', value: '$7,992,600', change: 5.7, icon: FiPieChart, color: 'purple' },
];

// Token management page
const TokensPage: React.FC = () => {
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [filterType, setFilterType] = useState('All');
  
  // Filter transactions by type
  const filteredTransactions = filterType === 'All' 
    ? transactions 
    : transactions.filter(tx => tx.type === filterType);
  
  // Calculate totals
  const totalDistributed = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const totalRewarded = transactions
    .filter(tx => tx.type === 'Reward')
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Token Management</h1>
      
      {/* Token Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {TOKEN_METRICS.map((metric, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{metric.title}</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                  {metric.value}
                </p>
              </div>
              <div className={`p-3 rounded-full bg-${metric.color}-100 dark:bg-${metric.color}-900/30 text-${metric.color}-600 dark:text-${metric.color}-400`}>
                <metric.icon className="w-6 h-6" />
              </div>
            </div>
            {metric.change && (
              <div className="mt-2">
                <span className={`text-sm font-medium ${metric.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} flex items-center`}>
                  {metric.change >= 0 ? <FiArrowUp className="mr-1" /> : <FiArrowDown className="mr-1" />}
                  {Math.abs(metric.change)}% from last month
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Token Price History</h2>
          <div className="h-64">
            <Line 
              data={TOKEN_PRICE_HISTORY} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: false,
                    grid: {
                      color: 'rgba(156, 163, 175, 0.1)'
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Token Distribution</h2>
          <div className="h-64 flex items-center justify-center">
            <Doughnut 
              data={TOKEN_DISTRIBUTION} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>
      
      {/* Token Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Token Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setIsTransferModalOpen(true)}
            className="flex items-center justify-center px-4 py-3 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/30 transition-colors"
          >
            <FiSend className="mr-2" />
            <span>Transfer Tokens</span>
          </button>
          
          <button className="flex items-center justify-center px-4 py-3 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors">
            <FiUsers className="mr-2" />
            <span>Manage Allocations</span>
          </button>
          
          <button className="flex items-center justify-center px-4 py-3 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/30 transition-colors">
            <FiLock className="mr-2" />
            <span>Vesting Schedules</span>
          </button>
        </div>
      </div>
      
      {/* Token Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Distribution Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-700 dark:text-gray-300">Total Distributed</span>
              <span className="font-medium text-gray-900 dark:text-white">{totalDistributed.toLocaleString()} LEARN</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-700 dark:text-gray-300">Total Rewarded</span>
              <span className="font-medium text-gray-900 dark:text-white">{totalRewarded.toLocaleString()} LEARN</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-700 dark:text-gray-300">Reward Recipients</span>
              <span className="font-medium text-gray-900 dark:text-white">{transactions.filter(tx => tx.type === 'Reward').length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">Average Reward Size</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {(totalRewarded / transactions.filter(tx => tx.type === 'Reward').length).toFixed(2)} LEARN
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {transactions.slice(0, 4).map((tx) => (
              <div key={tx.id} className="flex items-start">
                <div className={`p-2 rounded-full mr-3 ${
                  tx.type === 'Reward' ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' :
                  tx.type === 'Transfer' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' :
                  tx.type === 'Vesting' ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' :
                  'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  <FiDollarSign className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{tx.type}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{tx.amount} LEARN</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">To: {tx.recipient}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <FiClock className="mr-1 h-3 w-3" />
                      {new Date(tx.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Transaction History */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Transaction History</h2>
          <div className="flex space-x-2">
            <select
              className="block px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Reward">Rewards</option>
              <option value="Transfer">Transfers</option>
              <option value="Vesting">Vesting</option>
              <option value="Liquidity">Liquidity</option>
              <option value="Manual">Manual</option>
            </select>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none">
              <FiDownload className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              Export
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Recipient
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Transaction Hash
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${tx.type === 'Reward' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 
                      tx.type === 'Transfer' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' : 
                      tx.type === 'Vesting' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' : 
                      tx.type === 'Liquidity' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' : 
                      'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}`}
                    >
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{tx.recipient}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{tx.recipientWallet}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {tx.amount.toLocaleString()} LEARN
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {new Date(tx.timestamp).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(tx.timestamp).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${tx.status === 'Confirmed' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 
                      'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'}`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {tx.txHash === 'N/A' ? 'N/A' : (
                      <a 
                        href={`https://explorer.solana.com/tx/${tx.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        {tx.txHash.slice(0, 6)}...{tx.txHash.slice(-4)}
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TokensPage; 