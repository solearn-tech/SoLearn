import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { FiArrowLeft, FiCheckCircle, FiCircle, FiAward } from 'react-icons/fi';
import CoursePlayer from '../../../../components/courses/CoursePlayer';
import { WalletContextProvider } from '../../../../contexts/WalletContext';

// Mock course data (normally fetched from API)
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
          { 
            id: 'lesson-1-1', 
            title: 'What is Blockchain?', 
            duration: 15, 
            completed: false,
            videoUrl: 'https://example.com/videos/what-is-blockchain.mp4',
            description: 'This lesson introduces the basic concepts, history, and key features of blockchain technology, helping you understand the core value of blockchain.',
            resources: [
              { title: 'Blockchain Whitepaper', url: 'https://example.com/blockchain-whitepaper.pdf' },
              { title: 'Blockchain Timeline', url: 'https://example.com/blockchain-timeline.pdf' }
            ]
          },
          { 
            id: 'lesson-1-2', 
            title: 'The History of Blockchain', 
            duration: 20, 
            completed: false,
            videoUrl: 'https://example.com/videos/blockchain-history.mp4',
            description: 'Learn about the development history of blockchain technology, from the birth of Bitcoin to the evolution of modern blockchain platforms.',
            resources: []
          },
          { 
            id: 'lesson-1-3', 
            title: 'Blockchain vs. Traditional Databases', 
            duration: 25, 
            completed: false,
            videoUrl: 'https://example.com/videos/blockchain-vs-databases.mp4',
            description: 'Deeply compare the differences between blockchain and traditional databases, and understand when choosing blockchain technology is more appropriate.',
            resources: []
          }
        ]
      },
      {
        id: 'module-2',
        title: 'Cryptography Basics',
        duration: 90,
        lessons: [
          { 
            id: 'lesson-2-1', 
            title: 'Hashing Functions', 
            duration: 20, 
            completed: false,
            videoUrl: 'https://example.com/videos/hashing-functions.mp4',
            description: 'Understand the core role of hash functions in blockchain and how they ensure data integrity and security.',
            resources: []
          },
          // Other lessons
        ]
      },
      // Other modules
    ]
  },
  // Other courses
];

// Course player page
export default function LessonPage() {
  const router = useRouter();
  const { courseId, lessonId } = router.query;
  const [course, setCourse] = useState<any>(null);
  const [lesson, setLesson] = useState<any>(null);
  const [module, setModule] = useState<any>(null);
  const [nextLesson, setNextLesson] = useState<any>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  
  // Load course and lesson data
  useEffect(() => {
    if (courseId && lessonId) {
      // In a real scenario, this would be an API call
      const foundCourse = MOCK_COURSES.find(c => c.id === courseId);
      if (foundCourse) {
        setCourse(foundCourse);
        
        // Find current lesson and its module
        let currentModule;
        let currentLesson;
        let nextLesson = null;
        let foundCurrent = false;
        
        for (const mod of foundCourse.modules) {
          for (let i = 0; i < mod.lessons.length; i++) {
            const les = mod.lessons[i];
            
            if (les.id === lessonId) {
              currentLesson = les;
              currentModule = mod;
              foundCurrent = true;
              
              // Check if there's a next lesson
              if (i < mod.lessons.length - 1) {
                nextLesson = mod.lessons[i + 1];
              } else {
                // Check for first lesson of next module
                const moduleIndex = foundCourse.modules.findIndex(m => m.id === mod.id);
                if (moduleIndex < foundCourse.modules.length - 1) {
                  const nextModule = foundCourse.modules[moduleIndex + 1];
                  if (nextModule.lessons.length > 0) {
                    nextLesson = nextModule.lessons[0];
                  }
                }
              }
              
              break;
            }
          }
          if (foundCurrent) break;
        }
        
        setModule(currentModule);
        setLesson(currentLesson);
        setNextLesson(nextLesson);
      }
    }
    
    // Load completed lessons from localStorage
    const savedCompletedLessons = localStorage.getItem('completed-lessons');
    if (savedCompletedLessons) {
      setCompletedLessons(JSON.parse(savedCompletedLessons));
    }
  }, [courseId, lessonId]);
  
  // Handle lesson completion
  const handleLessonComplete = () => {
    if (lesson) {
      const newCompletedLessons = [...completedLessons];
      if (!newCompletedLessons.includes(lesson.id)) {
        newCompletedLessons.push(lesson.id);
        setCompletedLessons(newCompletedLessons);
        localStorage.setItem('completed-lessons', JSON.stringify(newCompletedLessons));
      }
    }
  };
  
  // Get course progress percentage
  const getProgressPercentage = () => {
    if (!course) return 0;
    
    let totalLessons = 0;
    course.modules.forEach(mod => {
      totalLessons += mod.lessons.length;
    });
    
    if (totalLessons === 0) return 0;
    return Math.round((completedLessons.length / totalLessons) * 100);
  };
  
  // If data not yet loaded, show loading state
  if (!course || !lesson || !module) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading course...</p>
        </div>
      </div>
    );
  }
  
  return (
    <WalletContextProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Head>
          <title>{lesson.title} | {course.title} | SoLearn</title>
          <meta name="description" content={lesson.description} />
        </Head>
        
        {/* Top navigation */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              <Link href={`/courses/${courseId}`} legacyBehavior>
                <a className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                  <FiArrowLeft className="mr-2" />
                  Back to Course Page
                </a>
              </Link>
              
              <div className="text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <div className="mr-2">Course Progress:</div>
                  <div className="w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div 
                      className="h-full bg-primary-500 rounded-full" 
                      style={{ width: `${getProgressPercentage()}%` }}
                    ></div>
                  </div>
                  <div className="ml-2">{getProgressPercentage()}%</div>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left side: video and content */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-6 overflow-hidden">
                <CoursePlayer
                  videoUrl={lesson.videoUrl}
                  title={lesson.title}
                  lessonId={lesson.id}
                  onComplete={handleLessonComplete}
                />
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{lesson.title}</h1>
                
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 mb-6">{lesson.description}</p>
                </div>
                
                {/* Resources section */}
                {lesson.resources && lesson.resources.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Lesson Resources</h3>
                    <ul className="space-y-2">
                      {lesson.resources.map((resource, idx) => (
                        <li key={idx}>
                          <a 
                            href={resource.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary-600 dark:text-primary-400 hover:underline"
                          >
                            {resource.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Complete lesson button */}
                <div className="mt-8 flex flex-col sm:flex-row justify-between items-center">
                  <button
                    onClick={handleLessonComplete}
                    className={`mb-4 sm:mb-0 px-6 py-2 rounded-lg flex items-center ${
                      completedLessons.includes(lesson.id)
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-primary-600 hover:bg-primary-700 text-white'
                    }`}
                  >
                    {completedLessons.includes(lesson.id) ? (
                      <>
                        <FiCheckCircle className="mr-2" />
                        Lesson Completed
                      </>
                    ) : (
                      <>
                        <FiCheckCircle className="mr-2" />
                        Mark as Completed
                      </>
                    )}
                  </button>
                  
                  {nextLesson && (
                    <Link href={`/courses/learn/${courseId}/${nextLesson.id}`} legacyBehavior>
                      <a className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg">
                        Next Lesson
                      </a>
                    </Link>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right side: course outline */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  {course.title}
                </h2>
                
                <div className="space-y-6">
                  {course.modules.map((mod) => (
                    <div key={mod.id}>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                        {mod.title}
                      </h3>
                      
                      <ul className="space-y-2">
                        {mod.lessons.map((les) => (
                          <li key={les.id}>
                            <Link 
                              href={`/courses/learn/${courseId}/${les.id}`}
                              legacyBehavior
                            >
                              <a className={`flex items-start py-2 px-3 rounded-lg ${
                                les.id === lesson.id
                                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                                  : 'hover:bg-gray-100 dark:hover:bg-gray-700/30 text-gray-700 dark:text-gray-300'
                              }`}>
                                {completedLessons.includes(les.id) ? (
                                  <FiCheckCircle className="mt-0.5 mr-2 flex-shrink-0 text-green-500" />
                                ) : (
                                  <FiCircle className="mt-0.5 mr-2 flex-shrink-0 text-gray-400" />
                                )}
                                <span>{les.title}</span>
                              </a>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                
                {/* Token reward info */}
                <div className="mt-8 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-100 dark:border-primary-800/30">
                  <div className="flex items-center mb-2">
                    <FiAward className="text-primary-500 mr-2" />
                    <h3 className="font-medium text-primary-700 dark:text-primary-400">Completion Reward</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    After completing this course, you will earn {course.tokenReward} $LEARN tokens!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </WalletContextProvider>
  );
} 