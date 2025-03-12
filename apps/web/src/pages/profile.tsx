import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { FiUser, FiMail, FiEdit2, FiSave, FiX, FiGlobe, FiTwitter, FiGithub } from 'react-icons/fi';
import { WalletContextProvider, useWallet } from '../contexts/WalletContext';

// Chinese comment replaced with English comment
interface SocialLinks {
  website: string;
  twitter: string;
  github: string;
}

interface Preferences {
  emailNotifications: boolean;
  marketingEmails: boolean;
  activityDigest: 'daily' | 'weekly' | 'monthly' | 'never';
}

interface UserData {
  username: string;
  email: string;
  bio: string;
  avatar: string;
  socialLinks: SocialLinks;
  preferences: Preferences;
}

// Chinese comment replaced with English comment
const mockUserData: UserData = {
  username: 'blockchain_learner',
  email: 'user@example.com',
  bio: 'Passionate about blockchain technology and Web3. Learning and building on Solana.',
  avatar: '/images/avatars/default.jpg',
  socialLinks: {
    website: 'https://example.com',
    twitter: 'https://twitter.com/SOLEARN_AI_',
    github: 'https://github.com/johndoe',
  },
  preferences: {
    emailNotifications: true,
    marketingEmails: false,
    activityDigest: 'weekly',
  },
};

// Chinese comment replaced with English comment
const ProfilePage = () => {
  const { connected, walletAddress } = useWallet();
  const [userData, setUserData] = useState(mockUserData);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(mockUserData);

  // Chinese comment replaced with English comment
  useEffect(() => {
    // Chinese comment replaced with English comment
    setUserData(mockUserData);
    setFormData(mockUserData);
  }, []);

  // Chinese comment replaced with English comment
  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      // Chinese comment replaced with English comment
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent as keyof UserData],
          [child]: type === 'checkbox' ? checked : value,
        },
      });
    } else {
      // Chinese comment replaced with English comment
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  // Chinese comment replaced with English comment
  const handleSocialLinkChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      socialLinks: {
        ...formData.socialLinks,
        [name]: value,
      },
    });
  };

  // Chinese comment replaced with English comment
  const toggleEditMode = () => {
    if (isEditing) {
      // Chinese comment replaced with English comment
      setFormData(userData);
    }
    setIsEditing(!isEditing);
  };

  // Chinese comment replaced with English comment
  const saveProfile = (e: any) => {
    e.preventDefault();
    // Chinese comment replaced with English comment
    setUserData(formData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>Profile | Solearn</title>
        <meta name="description" content="Manage your SoLearn profile" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Your Profile</h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            {/* Profile header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6 text-white">
              <div className="flex flex-col md:flex-row items-center md:items-start">
                <div className="w-24 h-24 rounded-full bg-white/20 overflow-hidden mb-4 md:mb-0 md:mr-6">
                  {userData.avatar ? (
                    <img 
                      src={userData.avatar} 
                      alt={userData.username} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiUser size={48} />
                    </div>
                  )}
                </div>
                
                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-bold">{userData.username}</h2>
                  <p className="text-white/80 mt-1">{userData.email}</p>
                  <p className="mt-2 max-w-lg">{userData.bio}</p>
                </div>
                
                <div className="ml-auto mt-4 md:mt-0">
                  <button
                    onClick={toggleEditMode}
                    className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  >
                    {isEditing ? (
                      <>
                        <FiX className="mr-2" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <FiEdit2 className="mr-2" />
                        Edit Profile
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Wallet address */}
              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="flex flex-col md:flex-row md:items-center">
                  <div>
                    <p className="text-sm text-white/70">Connected Wallet</p>
                    <p className="font-mono">{walletAddress || 'Not connected'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Profile content */}
            <div className="p-6">
              {isEditing ? (
                <form onSubmit={saveProfile}>
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Basic Information
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Username
                          </label>
                          <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Bio
                        </label>
                        <textarea
                          id="bio"
                          name="bio"
                          rows={3}
                          value={formData.bio}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                    
                    {/* Social Links */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Social Links
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <FiGlobe className="text-gray-500 dark:text-gray-400 mr-3" />
                          <input
                            type="url"
                            name="website"
                            placeholder="Your website"
                            value={formData.socialLinks.website}
                            onChange={handleSocialLinkChange}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        
                        <div className="flex items-center">
                          <FiTwitter className="text-gray-500 dark:text-gray-400 mr-3" />
                          <input
                            type="url"
                            name="twitter"
                            placeholder="Twitter profile"
                            value={formData.socialLinks.twitter}
                            onChange={handleSocialLinkChange}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        
                        <div className="flex items-center">
                          <FiGithub className="text-gray-500 dark:text-gray-400 mr-3" />
                          <input
                            type="url"
                            name="github"
                            placeholder="GitHub profile"
                            value={formData.socialLinks.github}
                            onChange={handleSocialLinkChange}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Notification Preferences */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Notification Preferences
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="emailNotifications"
                            name="preferences.emailNotifications"
                            checked={formData.preferences.emailNotifications}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                            Email notifications for course updates
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="marketingEmails"
                            name="preferences.marketingEmails"
                            checked={formData.preferences.marketingEmails}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <label htmlFor="marketingEmails" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                            Marketing emails and newsletters
                          </label>
                        </div>
                        
                        <div>
                          <label htmlFor="activityDigest" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Activity Digest
                          </label>
                          <select
                            id="activityDigest"
                            name="preferences.activityDigest"
                            value={formData.preferences.activityDigest}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                          >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="never">Never</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={toggleEditMode}
                        className="px-4 py-2 mr-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md shadow-sm"
                      >
                        <FiSave className="inline-block mr-2" />
                        Save Changes
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="space-y-8">
                  {/* Social Links */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Social Links
                    </h3>
                    
                    <div className="space-y-3">
                      {userData.socialLinks.website && (
                        <div className="flex items-center">
                          <FiGlobe className="text-gray-500 dark:text-gray-400 mr-3" />
                          <a 
                            href={userData.socialLinks.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary-600 dark:text-primary-400 hover:underline"
                          >
                            {userData.socialLinks.website}
                          </a>
                        </div>
                      )}
                      
                      {userData.socialLinks.twitter && (
                        <div className="flex items-center">
                          <FiTwitter className="text-gray-500 dark:text-gray-400 mr-3" />
                          <a 
                            href={userData.socialLinks.twitter} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary-600 dark:text-primary-400 hover:underline"
                          >
                            {userData.socialLinks.twitter.replace('https://twitter.com/', '@')}
                          </a>
                        </div>
                      )}
                      
                      {userData.socialLinks.github && (
                        <div className="flex items-center">
                          <FiGithub className="text-gray-500 dark:text-gray-400 mr-3" />
                          <a 
                            href={userData.socialLinks.github} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary-600 dark:text-primary-400 hover:underline"
                          >
                            {userData.socialLinks.github.replace('https://github.com/', '')}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Notification Preferences */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Notification Preferences
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className={`h-4 w-4 rounded ${userData.preferences.emailNotifications ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                        <span className="ml-2 text-gray-700 dark:text-gray-300">
                          Email notifications for course updates
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <div className={`h-4 w-4 rounded ${userData.preferences.marketingEmails ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                        <span className="ml-2 text-gray-700 dark:text-gray-300">
                          Marketing emails and newsletters
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-gray-700 dark:text-gray-300">
                          Activity Digest: <span className="font-medium">{userData.preferences.activityDigest.charAt(0).toUpperCase() + userData.preferences.activityDigest.slice(1)}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Chinese comment replaced with English comment
export default function Profile() {
  return (
    <WalletContextProvider>
      <ProfilePage />
    </WalletContextProvider>
  );
} 