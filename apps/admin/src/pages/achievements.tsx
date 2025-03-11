import React, { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiEye, 
  FiGrid,
  FiList,
  FiAward,
  FiExternalLink
} from 'react-icons/fi';

// Mock achievement data
const MOCK_ACHIEVEMENTS = [
  {
    id: '1',
    title: 'Solana Pioneer',
    description: 'Completed the Solana Fundamentals course with 90% or higher score',
    category: 'Course Completion',
    rarity: 'Common',
    requirements: 'Complete Solana Fundamentals course with 90%+ score',
    earnedBy: 487,
    tokenReward: 100,
    mintDate: '2023-02-20',
    status: 'Active',
    image: '/achievement-images/solana-pioneer.png'
  },
  {
    id: '2',
    title: 'Smart Contract Developer',
    description: 'Successfully deployed a smart contract to Solana devnet',
    category: 'Development',
    rarity: 'Rare',
    requirements: 'Deploy a verified smart contract to Solana devnet',
    earnedBy: 124,
    tokenReward: 250,
    mintDate: '2023-03-15',
    status: 'Active', 
    image: '/achievement-images/smart-contract-dev.png'
  },
  {
    id: '3',
    title: 'Community Contributor',
    description: 'Made valuable contributions to the learning community',
    category: 'Community',
    rarity: 'Uncommon',
    requirements: 'Receive 50+ upvotes on forum posts or comments',
    earnedBy: 215,
    tokenReward: 150,
    mintDate: '2023-04-10',
    status: 'Active',
    image: '/achievement-images/community-contributor.png'
  },
  {
    id: '4',
    title: 'DeFi Explorer',
    description: 'Completed the entire DeFi learning track',
    category: 'Course Completion',
    rarity: 'Uncommon',
    requirements: 'Complete all courses in the DeFi learning track',
    earnedBy: 98,
    tokenReward: 200,
    mintDate: '2023-05-25',
    status: 'Active',
    image: '/achievement-images/defi-explorer.png'
  },
  {
    id: '5',
    title: 'NFT Artist',
    description: 'Created and minted an NFT on Solana',
    category: 'NFTs',
    rarity: 'Rare',
    requirements: 'Successfully create and mint an NFT on Solana',
    earnedBy: 156,
    tokenReward: 250,
    mintDate: '2023-06-20',
    status: 'Active',
    image: '/achievement-images/nft-artist.png'
  },
  {
    id: '6',
    title: 'Security Sentinel',
    description: 'Completed Blockchain Security course with perfect score',
    category: 'Security',
    rarity: 'Epic',
    requirements: 'Complete Blockchain Security course with 100% score',
    earnedBy: 28,
    tokenReward: 500,
    mintDate: null,
    status: 'Draft',
    image: '/achievement-images/security-sentinel.png'
  },
  {
    id: '7',
    title: 'Solana Master',
    description: 'Completed all core Solana development courses',
    category: 'Course Completion',
    rarity: 'Legendary',
    requirements: 'Complete all Solana development core courses',
    earnedBy: 15,
    tokenReward: 1000,
    mintDate: '2023-07-15',
    status: 'Active',
    image: '/achievement-images/solana-master.png'
  },
  {
    id: '8',
    title: 'Rust Pioneer',
    description: 'Completed Rust for Blockchain course with distinction',
    category: 'Development',
    rarity: 'Epic',
    requirements: 'Complete Rust for Blockchain course with 95%+ score',
    earnedBy: 42,
    tokenReward: 500,
    mintDate: null,
    status: 'Draft',
    image: '/achievement-images/rust-pioneer.png'
  }
];

// Categories for filtering
const CATEGORIES = [
  'All Categories',
  'Course Completion',
  'Development',
  'Community',
  'NFTs',
  'Security'
];

// Rarity levels for filtering
const RARITIES = [
  'All Rarities',
  'Common',
  'Uncommon',
  'Rare',
  'Epic',
  'Legendary'
];

// Achievement management page
const AchievementsPage: React.FC = () => {
  const [achievements, setAchievements] = useState(MOCK_ACHIEVEMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedRarity, setSelectedRarity] = useState('All Rarities');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Filter achievements based on search and filters
  const filteredAchievements = achievements.filter(achievement => {
    const matchesSearch = achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        achievement.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All Categories' || achievement.category === selectedCategory;
    const matchesRarity = selectedRarity === 'All Rarities' || achievement.rarity === selectedRarity;
    const matchesStatus = selectedStatus === 'All Status' || achievement.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesRarity && matchesStatus;
  });
  
  // Sort achievements by rarity (Legendary to Common)
  const getRarityWeight = (rarity: string) => {
    switch(rarity) {
      case 'Legendary': return 5;
      case 'Epic': return 4;
      case 'Rare': return 3;
      case 'Uncommon': return 2;
      case 'Common': return 1;
      default: return 0;
    }
  };
  
  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    // First sort by status (Active first, then Draft)
    if (a.status === 'Active' && b.status !== 'Active') return -1;
    if (a.status !== 'Active' && b.status === 'Active') return 1;
    
    // Then sort by rarity
    return getRarityWeight(b.rarity) - getRarityWeight(a.rarity);
  });
  
  // Generate badge color based on rarity
  const getRarityColor = (rarity: string) => {
    switch(rarity) {
      case 'Common': 
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
      case 'Uncommon': 
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'Rare': 
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'Epic': 
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300';
      case 'Legendary': 
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      default: 
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Achievements</h1>
        <div className="flex mt-4 sm:mt-0">
          <div className="flex border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden mr-4">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
            >
              <FiGrid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
            >
              <FiList className="h-5 w-5" />
            </button>
          </div>
          
          <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-sm flex items-center">
            <FiPlus className="mr-2" />
            Create Achievement
          </button>
        </div>
      </div>
      
      {/* Filters and search */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="col-span-1 md:col-span-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:text-white sm:text-sm"
              placeholder="Search achievements by title or description"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div>
          <select
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div>
          <select
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            value={selectedRarity}
            onChange={(e) => setSelectedRarity(e.target.value)}
          >
            {RARITIES.map((rarity) => (
              <option key={rarity} value={rarity}>{rarity}</option>
            ))}
          </select>
        </div>
        
        <div>
          <select
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="All Status">All Status</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>
      
      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedAchievements.map((achievement) => (
            <div key={achievement.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="relative h-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <FiAward className="h-16 w-16 text-primary-600 dark:text-primary-400" />
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(achievement.rarity)}`}>
                    {achievement.rarity}
                  </span>
                </div>
                {achievement.status === 'Draft' && (
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                      Draft
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">{achievement.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                  {achievement.description}
                </p>
                
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {achievement.category}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {achievement.tokenReward} LEARN
                  </span>
                </div>
                
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Earned by {achievement.earnedBy} users
                </div>
                
                <div className="flex space-x-2 mt-4">
                  <button className="flex-1 px-3 py-2 text-xs text-center bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-900/30">
                    <FiEye className="inline-block mr-1" /> View
                  </button>
                  <button className="flex-1 px-3 py-2 text-xs text-center bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30">
                    <FiEdit2 className="inline-block mr-1" /> Edit
                  </button>
                  <button className="flex-1 px-3 py-2 text-xs text-center bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30">
                    <FiTrash2 className="inline-block mr-1" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Achievement
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Rarity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Token Reward
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Earned By
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedAchievements.map((achievement) => (
                <tr key={achievement.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-md bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                        <FiAward className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{achievement.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 max-w-xs truncate">
                          {achievement.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700 dark:text-gray-300">{achievement.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRarityColor(achievement.rarity)}`}>
                      {achievement.rarity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {achievement.tokenReward} LEARN
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {achievement.earnedBy} users
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${achievement.status === 'Active' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 
                        'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'}`}
                    >
                      {achievement.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300">
                        <FiEye className="h-5 w-5" />
                      </button>
                      <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
                        <FiEdit2 className="h-5 w-5" />
                      </button>
                      <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                      {achievement.status === 'Active' && (
                        <button className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300">
                          <FiExternalLink className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AchievementsPage; 