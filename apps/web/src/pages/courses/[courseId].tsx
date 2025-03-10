import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { FiArrowLeft, FiClock, FiUsers, FiAward, FiBookOpen, FiCheck } from 'react-icons/fi';
import { WalletContextProvider } from '../../contexts/WalletContext';

// Mock course data
const MOCK_COURSES = [
  {
    id: 'blockchain-fundamentals',
    title: 'Blockchain Fundamentals',
    description: 'Learn the core concepts of blockchain technology, cryptocurrencies, and decentralized applications.',
    thumbnailUrl: '/images/courses/blockchain-fundamentals.jpg',
    level: 'beginner',
    duration: 300, // 5 hours
    rating: 4.8,
    enrollmentCount: 3500,
    tokenReward: 50,
    category: 'Blockchain',
    instructor: 'Dr. Sarah Chen',
    instructorTitle: 'Blockchain Researcher & Educator',
    instructorAvatar: '/images/instructors/sarah-chen.jpg',
    modules: [
      {
        id: 'module-1',
        title: 'Introduction to Blockchain',
        duration: 60,
        lessons: [
          { id: 'lesson-1-1', title: 'What is Blockchain?', duration: 15, completed: false },
          { id: 'lesson-1-2', title: 'The History of Blockchain', duration: 20, completed: false },
          { id: 'lesson-1-3', title: 'Blockchain vs. Traditional Databases', duration: 25, completed: false }
        ]
      },
      {
        id: 'module-2',
        title: 'Cryptography Basics',
        duration: 90,
        lessons: [
          { id: 'lesson-2-1', title: 'Hashing Functions', duration: 20, completed: false },
          { id: 'lesson-2-2', title: 'Public Key Cryptography', duration: 25, completed: false },
          { id: 'lesson-2-3', title: 'Digital Signatures', duration: 20, completed: false },
          { id: 'lesson-2-4', title: 'Practical Cryptography Exercise', duration: 25, completed: false }
        ]
      },
      {
        id: 'module-3',
        title: 'Blockchain Architecture',
        duration: 75,
        lessons: [
          { id: 'lesson-3-1', title: 'Blocks and Chains', duration: 15, completed: false },
          { id: 'lesson-3-2', title: 'Consensus Mechanisms', duration: 25, completed: false },
          { id: 'lesson-3-3', title: 'Mining and Validators', duration: 20, completed: false },
          { id: 'lesson-3-4', title: 'Network Types', duration: 15, completed: false }
        ]
      },
      {
        id: 'module-4',
        title: 'Blockchain Applications',
        duration: 75,
        lessons: [
          { id: 'lesson-4-1', title: 'Cryptocurrencies', duration: 20, completed: false },
          { id: 'lesson-4-2', title: 'Smart Contracts', duration: 20, completed: false },
          { id: 'lesson-4-3', title: 'DApps (Decentralized Applications)', duration: 20, completed: false },
          { id: 'lesson-4-4', title: 'Future Applications', duration: 15, completed: false }
        ]
      }
    ],
    prerequisites: [
      'Basic understanding of computer science concepts',
      'Familiarity with digital technologies',
      'No prior blockchain knowledge required'
    ],
    whatYouWillLearn: [
      'Understand the fundamental concepts of blockchain technology',
      'Explain how cryptography secures blockchain networks',
      'Differentiate between various consensus mechanisms',
      'Describe common blockchain applications and use cases',
      'Identify the components of blockchain architecture'
    ],
    longDescription: `This comprehensive course introduces you to the fascinating world of blockchain technology. You'll start with the foundational concepts that make blockchain revolutionary and proceed to understand its technical underpinnings.

Throughout the course, you'll learn about cryptographic principles, consensus mechanisms, and the architecture that enables secure, decentralized record-keeping. We'll explore different types of blockchains, their applications beyond cryptocurrencies, and how they're transforming industries.

By the end of this course, you'll have a solid understanding of blockchain fundamentals and be prepared to explore more advanced topics in this rapidly evolving field. This knowledge serves as an essential foundation for anyone interested in cryptocurrency, Web3 development, or blockchain applications.`
  },
  {
    id: 'solana-development',
    title: 'Solana Programming with Rust',
    description: 'Master Solana blockchain development using Rust and the Anchor framework.',
    thumbnailUrl: '/images/courses/solana-development.jpg',
    level: 'intermediate',
    duration: 480,
    rating: 4.9,
    enrollmentCount: 1200,
    tokenReward: 120,
    category: 'Development',
    instructor: 'Alex Rivera',
    instructorTitle: 'Senior Blockchain Developer',
    instructorAvatar: '/images/instructors/alex-rivera.jpg',
    // Other mock data...
    modules: [],
    prerequisites: [],
    whatYouWillLearn: [],
    longDescription: ''
  },
  // Other courses...
];

// Format duration (minutes to hours and minutes)
const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins} minutes`;
  if (mins === 0) return `${hours} hours`;
  return `${hours} hours ${mins} minutes`;
};

// Get badge color based on course level
const getLevelColor = (level: string): string => {
  switch (level) {
    case 'beginner':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'intermediate':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'advanced':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  }
};

// Get level name
const getLevelName = (level: string): string => {
  switch (level) {
    case 'beginner':
      return 'Beginner';
    case 'intermediate':
      return 'Intermediate';
    case 'advanced':
      return 'Advanced';
    default:
      return 'Unknown';
  }
};

export default function CourseDetailPage() {
  const router = useRouter();
  const { courseId } = router.query;
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'reviews'>('overview');
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  
  // Find current course
  const course = MOCK_COURSES.find(c => c.id === courseId);
  
  // If course not found or page is loading, show loading state
  if (!course || router.isFallback) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading course...</p>
        </div>
      </div>
    );
  }
  
  // Toggle module expand/collapse state
  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  // Calculate total lessons
  const totalLessons = course.modules.reduce(
    (total, module) => total + module.lessons.length, 
    0
  );
  
  return (
    <WalletContextProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Head>
          <title>{course.title} | SoLearn</title>
          <meta name="description" content={course.description} />
        </Head>
        
        {/* Top navigation */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-4">
            <Link href="/courses" legacyBehavior>
              <a className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                <FiArrowLeft className="mr-2" />
                Back to Course List
              </a>
            </Link>
          </div>
        </div>
        
        {/* Course header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <div className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Course image */}
              <div className="md:col-span-1">
                <div className="relative rounded-lg overflow-hidden shadow-xl h-60 w-full md:h-80">
                  {course.thumbnailUrl ? (
                    <Image
                      src={course.thumbnailUrl}
                      alt={course.title}
                      layout="fill"
                      objectFit="cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                      <FiBookOpen size={48} className="text-gray-500 dark:text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Course information */}
              <div className="md:col-span-2">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                    {getLevelName(course.level)}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/20">
                    {course.category}
                  </span>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{course.title}</h1>
                <p className="text-lg text-white/80 mb-6">{course.description}</p>
                
                <div className="flex flex-wrap items-center text-white/80 gap-y-2 gap-x-6 mb-8">
                  <div className="flex items-center">
                    <FiClock className="mr-2" />
                    <span>{formatDuration(course.duration)}</span>
                  </div>
                  <div className="flex items-center">
                    <FiUsers className="mr-2" />
                    <span>{course.enrollmentCount.toLocaleString()} students enrolled</span>
                  </div>
                  <div className="flex items-center">
                    <FiAward className="mr-2" />
                    <span>{course.tokenReward} $LEARN token reward</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full overflow-hidden bg-white/20 mr-3">
                      {course.instructorAvatar ? (
                        <Image
                          src={course.instructorAvatar}
                          alt={course.instructor}
                          width={48}
                          height={48}
                          objectFit="cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <FiUsers className="text-white/60" size={20} />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{course.instructor}</div>
                      <div className="text-sm text-white/70">{course.instructorTitle}</div>
                    </div>
                  </div>
                </div>
                
                <button className="bg-white text-primary-600 hover:bg-white/90 px-6 py-3 rounded-lg font-semibold shadow-lg transition duration-150 ease-in-out">
                  Start Learning
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {/* Tab navigation */}
              <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
                <nav className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`py-4 px-1 inline-flex items-center ${
                      activeTab === 'overview'
                        ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    Course Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('curriculum')}
                    className={`py-4 px-1 inline-flex items-center ${
                      activeTab === 'curriculum'
                        ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    Curriculum
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`py-4 px-1 inline-flex items-center ${
                      activeTab === 'reviews'
                        ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    Reviews
                  </button>
                </nav>
              </div>
              
              {/* Course overview */}
              {activeTab === 'overview' && (
                <div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Course Description</h2>
                    <div className="prose dark:prose-invert max-w-none">
                      {course.longDescription.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className="mb-4 text-gray-700 dark:text-gray-300">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">What You Will Learn</h2>
                    <ul className="grid sm:grid-cols-2 gap-y-2 gap-x-4">
                      {course.whatYouWillLearn.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <FiCheck className="mt-1 mr-2 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {course.prerequisites.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Prerequisites</h2>
                      <ul className="space-y-2">
                        {course.prerequisites.map((prerequisite, idx) => (
                          <li key={idx} className="flex items-start">
                            <FiCheck className="mt-1 mr-2 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{prerequisite}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              {/* Course curriculum */}
              {activeTab === 'curriculum' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Course Content</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {course.modules.length} modules • {totalLessons} lessons • Total duration: {formatDuration(course.duration)}
                  </p>
                  
                  <div className="space-y-4">
                    {course.modules.map((module) => (
                      <div key={module.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleModule(module.id)}
                          className="w-full flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
                        >
                          <div className="flex items-center">
                            <div className="font-medium text-left text-gray-900 dark:text-white">{module.title}</div>
                          </div>
                          <div className="flex items-center text-gray-500 dark:text-gray-400">
                            <span className="mr-4">{module.lessons.length} lessons • {formatDuration(module.duration)}</span>
                            <svg
                              className={`w-5 h-5 transform transition-transform ${
                                expandedModules.includes(module.id) ? 'rotate-180' : ''
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                          </div>
                        </button>
                        
                        {expandedModules.includes(module.id) && (
                          <div className="border-t border-gray-200 dark:border-gray-700">
                            {module.lessons.map((lesson, index) => (
                              <div
                                key={lesson.id}
                                className={`p-4 flex justify-between items-center ${
                                  index !== module.lessons.length - 1
                                    ? 'border-b border-gray-200 dark:border-gray-700'
                                    : ''
                                }`}
                              >
                                <div className="flex items-center">
                                  <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3 text-xs">
                                    {index + 1}
                                  </div>
                                  <span className="text-gray-800 dark:text-gray-200">{lesson.title}</span>
                                </div>
                                <div className="text-gray-500 dark:text-gray-400 text-sm">
                                  {formatDuration(lesson.duration)}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Student reviews */}
              {activeTab === 'reviews' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Student Reviews</h2>
                  <div className="flex items-center mb-8">
                    <div className="mr-4">
                      <div className="text-5xl font-bold text-gray-900 dark:text-white">{course.rating}</div>
                      <div className="flex text-yellow-400 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-5 h-5 ${i < Math.floor(course.rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        ))}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {course.enrollmentCount} students
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      {/* Mock rating distribution */}
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center">
                            <div className="min-w-[30px] text-gray-700 dark:text-gray-300">{rating} stars</div>
                            <div className="flex-1 mx-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-yellow-400"
                                style={{
                                  width: `${
                                    rating === 5
                                      ? '75%'
                                      : rating === 4
                                      ? '20%'
                                      : rating === 3
                                      ? '3%'
                                      : rating === 2
                                      ? '1%'
                                      : '1%'
                                  }`,
                                }}
                              ></div>
                            </div>
                            <div className="min-w-[40px] text-right text-gray-500 dark:text-gray-400 text-sm">
                              {rating === 5
                                ? '75%'
                                : rating === 4
                                ? '20%'
                                : rating === 3
                                ? '3%'
                                : rating === 2
                                ? '1%'
                                : '1%'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>More reviews will be displayed after users complete the course</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Right sidebar */}
            <div className="md:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sticky top-8">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {course.tokenReward} <span className="text-primary-500">$LEARN</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Token reward for completing this course</p>
                
                <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium mb-4 transition duration-150 ease-in-out">
                  Start Learning
                </button>
                
                <div className="space-y-4 mt-6">
                  <div className="flex items-center">
                    <FiClock className="mr-3 text-gray-500 dark:text-gray-400" />
                    <div>
                      <div className="text-gray-900 dark:text-white">Course Duration</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{formatDuration(course.duration)}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <FiBookOpen className="mr-3 text-gray-500 dark:text-gray-400" />
                    <div>
                      <div className="text-gray-900 dark:text-white">Course Modules</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{course.modules.length} modules | {totalLessons} lessons</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <FiAward className="mr-3 text-gray-500 dark:text-gray-400" />
                    <div>
                      <div className="text-gray-900 dark:text-white">Course Level</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{getLevelName(course.level)}</div>
                    </div>
                  </div>
                </div>
                
                <hr className="my-6 border-gray-200 dark:border-gray-700" />
                
                <div className="text-center">
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                    Having issues? Contact the course instructor for help
                  </p>
                  <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm">
                    Contact Instructor
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WalletContextProvider>
  );
} 