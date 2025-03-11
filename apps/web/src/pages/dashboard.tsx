import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FiBook, FiAward, FiTrendingUp, FiDollarSign, FiClock, FiCheckCircle } from 'react-icons/fi';
import { WalletContextProvider, useWallet } from '../contexts/WalletContext';

// Dashboard page component
const DashboardPage = () => {
  const { connected, walletAddress, balance, learningTokens } = useWallet();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [learningStats, setLearningStats] = useState({
    totalMinutes: 0,
    coursesCompleted: 0,
    lessonsCompleted: 0,
    tokensEarned: 0
  });

  // Mock data for enrolled courses
  const mockEnrolledCourses = [
    {
      id: 'blockchain-fundamentals',
      title: 'Blockchain Fundamentals',
      progress: 75,
      thumbnailUrl: '/images/courses/blockchain-fundamentals.jpg',
      lastAccessed: '2023-06-10T14:30:00Z'
    },
    {
      id: 'solana-development',
      title: 'Solana Programming with Rust',
      progress: 30,
      thumbnailUrl: '/images/courses/solana-development.jpg',
      lastAccessed: '2023-06-08T10:15:00Z'
    },
    {
      id: 'defi-protocols',
      title: 'DeFi Protocol Deep Dive',
      progress: 10,
      thumbnailUrl: '/images/courses/defi-protocols.jpg',
      lastAccessed: '2023-06-05T16:45:00Z'
    }
  ];

  // Mock data for achievements
  const mockAchievements = [
    {
      id: 'blockchain-pioneer',
      title: 'Blockchain Pioneer',
      description: 'Completed your first blockchain course',
      dateEarned: '2023-05-20T09:30:00Z',
      iconUrl: '/images/achievements/blockchain-pioneer.png'
    },
    {
      id: 'quick-learner',
      title: 'Quick Learner',
      description: 'Completed 5 lessons in a single day',
      dateEarned: '2023-05-25T14:20:00Z',
      iconUrl: '/images/achievements/quick-learner.png'
    },
    {
      id: 'consistent-scholar',
      title: 'Consistent Scholar',
      description: 'Studied for 7 consecutive days',
      dateEarned: '2023-06-01T11:10:00Z',
      iconUrl: '/images/achievements/consistent-scholar.png'
    }
  ];

  // Mock learning statistics
  const mockLearningStats = {
    totalMinutes: 840,
    coursesCompleted: 1,
    lessonsCompleted: 23,
    tokensEarned: 75
  };

  // Load data on component mount
  useEffect(() => {
    // In a real application, these would be API calls
    setEnrolledCourses(mockEnrolledCourses);
    setCompletedCourses(mockEnrolledCourses.filter(course => course.progress === 100));
    setAchievements(mockAchievements);
    setLearningStats(mockLearningStats);
  }, []);

  // Format date to readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format minutes to hours and minutes
  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>Dashboard | Solearn</title>
        <meta name="description" content="Track your learning progress and achievements" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl shadow-lg p-6 mb-8 text-white">
          <h1 className="text-2xl font-bold mb-2">
            Welcome {walletAddress ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}` : 'to Solearn'}
          </h1>
          <p className="mb-4">Track your learning progress, achievements, and rewards</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center">
                <FiBook className="text-2xl mr-3" />
                <div>
                  <p className="text-sm opacity-80">Enrolled Courses</p>
                  <p className="text-xl font-semibold">{enrolledCourses.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center">
                <FiAward className="text-2xl mr-3" />
                <div>
                  <p className="text-sm opacity-80">Achievements</p>
                  <p className="text-xl font-semibold">{achievements.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center">
                <FiTrendingUp className="text-2xl mr-3" />
                <div>
                  <p className="text-sm opacity-80">Learning Time</p>
                  <p className="text-xl font-semibold">{formatTime(learningStats.totalMinutes)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center">
                <FiDollarSign className="text-2xl mr-3" />
                <div>
                  <p className="text-sm opacity-80">$LEARN Tokens</p>
                  <p className="text-xl font-semibold">{learningTokens}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-8">
            {/* In Progress Courses */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">In Progress Courses</h2>
                <Link href="/courses" legacyBehavior>
                  <a className="text-primary-600 dark:text-primary-400 text-sm hover:underline">
                    Browse all courses
                  </a>
                </Link>
              </div>
              
              {enrolledCourses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">You haven't enrolled in any courses yet</p>
                  <Link href="/courses" legacyBehavior>
                    <a className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg">
                      Explore Courses
                    </a>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {enrolledCourses.map(course => (
                    <div key={course.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mr-4 overflow-hidden">
                            {course.thumbnailUrl && (
                              <img 
                                src={course.thumbnailUrl} 
                                alt={course.title} 
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">{course.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Last accessed: {formatDate(course.lastAccessed)}
                            </p>
                          </div>
                        </div>
                        <Link href={`/courses/learn/${course.id}/lesson-1-1`} legacyBehavior>
                          <a className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white text-sm rounded">
                            Continue
                          </a>
                        </Link>
                      </div>
                      
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">Progress</span>
                          <span className="text-gray-900 dark:text-white font-medium">{course.progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary-500 rounded-full" 
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Recent Activity</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-full mr-4">
                    <FiCheckCircle className="text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-white">Completed lesson "What is Blockchain?"</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-full mr-4">
                    <FiAward className="text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-white">Earned "Consistent Scholar" achievement</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">1 day ago</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-full mr-4">
                    <FiDollarSign className="text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-white">Earned 15 $LEARN tokens</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">2 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column */}
          <div className="space-y-8">
            {/* Achievements */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Achievements</h2>
              
              {achievements.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    Complete courses to earn achievements
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {achievements.map(achievement => (
                    <div key={achievement.id} className="flex items-start">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full mr-4 flex items-center justify-center overflow-hidden">
                        {achievement.iconUrl ? (
                          <img 
                            src={achievement.iconUrl} 
                            alt={achievement.title} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FiAward className="text-gray-500 dark:text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{achievement.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Earned on {formatDate(achievement.dateEarned)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Learning Statistics */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Learning Statistics</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <FiClock className="text-gray-500 dark:text-gray-400 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">Total Learning Time</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatTime(learningStats.totalMinutes)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <FiCheckCircle className="text-gray-500 dark:text-gray-400 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">Courses Completed</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {learningStats.coursesCompleted}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <FiBook className="text-gray-500 dark:text-gray-400 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">Lessons Completed</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {learningStats.lessonsCompleted}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <FiDollarSign className="text-gray-500 dark:text-gray-400 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">Tokens Earned</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {learningStats.tokensEarned} $LEARN
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Wrap the dashboard with the wallet context provider
export default function Dashboard() {
  return (
    <WalletContextProvider>
      <DashboardPage />
    </WalletContextProvider>
  );
} 