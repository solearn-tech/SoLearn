import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import StatsCard from '../components/ui/StatsCard';
import { HiOutlineUserGroup, HiOutlineAcademicCap, HiOutlineBadgeCheck, HiOutlineCurrencyDollar } from 'react-icons/hi';

// Placeholder data for demonstration
const userStats = {
  total: 12489,
  active: 9852,
  newToday: 57,
  growth: 8.2
};

const courseStats = {
  total: 234,
  active: 198,
  published: 187,
  inDraft: 47
};

const rewardStats = {
  tokensDistributed: 1250000,
  nftsMinted: 7865,
  rewardsPending: 23452,
  rewardsProcessed: 245877
};

// Monthly stats for charts
const monthlyStats = [
  { month: 'Jan', users: 5200, completions: 1200, rewards: 35000 },
  { month: 'Feb', users: 5800, completions: 1350, rewards: 38000 },
  { month: 'Mar', users: 6200, completions: 1450, rewards: 42000 },
  { month: 'Apr', users: 6800, completions: 1600, rewards: 46000 },
  { month: 'May', users: 7500, completions: 1800, rewards: 52000 },
  { month: 'Jun', users: 8200, completions: 2000, rewards: 58000 },
  { month: 'Jul', users: 9100, completions: 2300, rewards: 68000 },
  { month: 'Aug', users: 10200, completions: 2600, rewards: 78000 },
  { month: 'Sep', users: 11000, completions: 2800, rewards: 85000 },
  { month: 'Oct', users: 11800, completions: 3000, rewards: 92000 },
  { month: 'Nov', users: 12200, completions: 3100, rewards: 96000 },
  { month: 'Dec', users: 12489, completions: 3200, rewards: 98000 }
];

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  return (
    <AdminLayout>
      <PageHeader 
        title="Dashboard" 
        subtitle="Overview of platform performance and statistics"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Total Users"
          value={formatNumber(userStats.total)}
          change={{ 
            value: `+${userStats.newToday} today`, 
            type: 'increase' 
          }}
          icon={<HiOutlineUserGroup className="h-6 w-6" />}
        />
        
        <StatsCard
          title="Active Courses"
          value={formatNumber(courseStats.active)}
          change={{ 
            value: `${courseStats.inDraft} in draft`, 
            type: 'neutral' 
          }}
          icon={<HiOutlineAcademicCap className="h-6 w-6" />}
          iconBgColor="bg-blue-500"
        />
        
        <StatsCard
          title="Achievements Issued"
          value={formatNumber(rewardStats.nftsMinted)}
          change={{ 
            value: "+12.5% this month", 
            type: 'increase' 
          }}
          icon={<HiOutlineBadgeCheck className="h-6 w-6" />}
          iconBgColor="bg-green-500"
        />
        
        <StatsCard
          title="LEARN Tokens Distributed"
          value={formatNumber(rewardStats.tokensDistributed)}
          change={{ 
            value: "+8.3% this month", 
            type: 'increase' 
          }}
          icon={<HiOutlineCurrencyDollar className="h-6 w-6" />}
          iconBgColor="bg-yellow-500"
        />
      </div>

      {/* Main Content Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Platform Growth */}
        <Card
          title="Platform Growth"
          subtitle="Monthly user growth and activity"
        >
          <div className="h-80 flex items-center justify-center">
            {isLoading ? (
              <div className="flex flex-col items-center">
                <svg className="animate-spin h-10 w-10 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Loading chart data...</p>
              </div>
            ) : (
              <div className="w-full">
                <p className="text-center text-lg font-medium text-gray-700 dark:text-gray-300">
                  Growth: {userStats.growth}% over last month
                </p>
                <div className="h-64 mt-4 text-center text-gray-600 dark:text-gray-400">
                  [Chart Visualization Placeholder]
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Rewards Distribution */}
        <Card
          title="Rewards Distribution"
          subtitle="Token rewards and NFT achievements"
        >
          <div className="h-80 flex items-center justify-center">
            {isLoading ? (
              <div className="flex flex-col items-center">
                <svg className="animate-spin h-10 w-10 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Loading chart data...</p>
              </div>
            ) : (
              <div className="w-full">
                <div className="flex justify-between mb-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tokens Distributed</p>
                    <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{formatNumber(rewardStats.tokensDistributed)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">NFTs Minted</p>
                    <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{formatNumber(rewardStats.nftsMinted)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Rewards</p>
                    <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{formatNumber(rewardStats.rewardsPending)}</p>
                  </div>
                </div>
                <div className="h-52 mt-4 text-center text-gray-600 dark:text-gray-400">
                  [Chart Visualization Placeholder]
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card
        title="Recent Platform Activity"
        subtitle="Latest actions and events across the platform"
      >
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {isLoading ? (
            <div className="py-8 flex justify-center">
              <svg className="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : (
            <>
              <div className="py-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">New course published: "Advanced Solana Smart Contracts"</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">10 minutes ago by Instructor John Doe</p>
              </div>
              <div className="py-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">User milestone reached: 12,500 registered users</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
              </div>
              <div className="py-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Reward distribution completed: 25,000 LEARN tokens</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">4 hours ago</p>
              </div>
              <div className="py-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">New achievement created: "Solana Fundamentals Master"</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Yesterday at 3:45 PM</p>
              </div>
              <div className="py-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Platform update deployed: v1.2.5</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Yesterday at 12:30 PM</p>
              </div>
            </>
          )}
        </div>
      </Card>
    </AdminLayout>
  );
};

export default Dashboard; 