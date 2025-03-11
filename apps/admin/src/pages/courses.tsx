import React, { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiEye, 
  FiChevronDown,
  FiCheck,
  FiX,
  FiStar,
  FiFilter
} from 'react-icons/fi';

// Mock course data
const MOCK_COURSES = [
  {
    id: '1',
    title: 'Solana Fundamentals',
    description: 'Learn the basics of Solana blockchain and how it works',
    category: 'Blockchain Basics',
    instructor: 'Carol Davis',
    totalLessons: 12,
    totalEnrollments: 875,
    completionRate: 68,
    rating: 4.8,
    publishedAt: '2023-02-15',
    status: 'Published',
    featuredStatus: true,
    image: '/course-images/solana-fundamentals.jpg'
  },
  {
    id: '2',
    title: 'Smart Contract Development',
    description: 'Hands-on guide to developing smart contracts on Solana',
    category: 'Development',
    instructor: 'Grace Lee',
    totalLessons: 15,
    totalEnrollments: 650,
    completionRate: 54,
    rating: 4.6,
    publishedAt: '2023-03-10',
    status: 'Published',
    featuredStatus: true,
    image: '/course-images/smart-contract-dev.jpg'
  },
  {
    id: '3',
    title: 'Web3 Frontend Integration',
    description: 'Learn how to connect React frontends with Solana blockchain',
    category: 'Development',
    instructor: 'Bob Smith',
    totalLessons: 10,
    totalEnrollments: 425,
    completionRate: 42,
    rating: 4.5,
    publishedAt: '2023-04-05',
    status: 'Published',
    featuredStatus: false,
    image: '/course-images/web3-frontend.jpg'
  },
  {
    id: '4',
    title: 'DeFi Principles',
    description: 'Understanding Decentralized Finance protocols and mechanisms',
    category: 'Finance',
    instructor: 'Eve Brown',
    totalLessons: 8,
    totalEnrollments: 320,
    completionRate: 75,
    rating: 4.7,
    publishedAt: '2023-05-20',
    status: 'Published',
    featuredStatus: false,
    image: '/course-images/defi-principles.jpg'
  },
  {
    id: '5',
    title: 'NFT Creation Workshop',
    description: 'Learn to create, mint and sell NFT collections on Solana',
    category: 'NFTs',
    instructor: 'Grace Lee',
    totalLessons: 6,
    totalEnrollments: 560,
    completionRate: 88,
    rating: 4.9,
    publishedAt: '2023-06-15',
    status: 'Published',
    featuredStatus: true,
    image: '/course-images/nft-workshop.jpg'
  },
  {
    id: '6',
    title: 'Blockchain Security',
    description: 'Understanding security principles for blockchain applications',
    category: 'Security',
    instructor: 'Dave Wilson',
    totalLessons: 14,
    totalEnrollments: 290,
    completionRate: 62,
    rating: 4.7,
    publishedAt: null,
    status: 'Draft',
    featuredStatus: false,
    image: '/course-images/blockchain-security.jpg'
  },
  {
    id: '7',
    title: 'Solana Program Library',
    description: 'Deep dive into Solana Program Library (SPL) tokens and tools',
    category: 'Advanced Development',
    instructor: 'Carol Davis',
    totalLessons: 18,
    totalEnrollments: 175,
    completionRate: 35,
    rating: 4.8,
    publishedAt: '2023-07-05',
    status: 'Published',
    featuredStatus: false,
    image: '/course-images/solana-program-library.jpg'
  },
  {
    id: '8',
    title: 'Rust for Blockchain',
    description: 'Learning Rust programming language for blockchain development',
    category: 'Development',
    instructor: 'Frank Miller',
    totalLessons: 20,
    totalEnrollments: 410,
    completionRate: 28,
    rating: 4.6,
    publishedAt: null,
    status: 'Draft',
    featuredStatus: false,
    image: '/course-images/rust-blockchain.jpg'
  }
];

// Course Categories
const CATEGORIES = [
  'All Categories',
  'Blockchain Basics',
  'Development',
  'Advanced Development',
  'Finance',
  'NFTs',
  'Security'
];

// Course management component
const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState(MOCK_COURSES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(5);
  
  // Filter courses based on search and filters
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All Categories' || course.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All Status' || course.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
  
  // Sort courses by published date (newest first)
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (!a.publishedAt) return 1; // Draft courses at the end
    if (!b.publishedAt) return -1;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
  
  // Pagination
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = sortedCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(sortedCourses.length / coursesPerPage);
  
  // Pagination controls
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedStatus]);
  
  // Toggle featured status
  const toggleFeaturedStatus = (courseId: string) => {
    setCourses(courses.map(course => 
      course.id === courseId ? { ...course, featuredStatus: !course.featuredStatus } : course
    ));
  };
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Courses</h1>
        <button className="mt-4 sm:mt-0 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-sm flex items-center">
          <FiPlus className="mr-2" />
          Create Course
        </button>
      </div>
      
      {/* Filters and search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="col-span-1 md:col-span-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:text-white sm:text-sm"
              placeholder="Search courses by title, instructor or description"
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
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="All Status">All Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>
      
      {/* Courses table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Course
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Instructor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Enrollments
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Rating
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Featured
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {currentCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-primary-100 dark:bg-primary-900 rounded-md flex items-center justify-center">
                        <FiBook className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {course.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                          {course.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700 dark:text-gray-300">{course.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700 dark:text-gray-300">{course.instructor}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {course.totalEnrollments}
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        ({course.completionRate}% completed)
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-700 dark:text-gray-300 mr-1">{course.rating}</span>
                      <FiStar className="h-4 w-4 text-yellow-500" />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${course.status === 'Published' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 
                       'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'}`}
                    >
                      {course.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => toggleFeaturedStatus(course.id)}
                      className={`px-2 py-1 inline-flex items-center justify-center text-xs leading-5 font-medium rounded 
                        ${course.featuredStatus ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300' : 
                         'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
                    >
                      {course.featuredStatus ? <FiCheck className="h-4 w-4 mr-1" /> : <FiX className="h-4 w-4 mr-1" />}
                      {course.featuredStatus ? 'Featured' : 'Not Featured'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing <span className="font-medium">{indexOfFirstCourse + 1}</span> to{' '}
            <span className="font-medium">
              {indexOfLastCourse > sortedCourses.length ? sortedCourses.length : indexOfLastCourse}
            </span>{' '}
            of <span className="font-medium">{sortedCourses.length}</span> courses
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
              disabled={currentPage === 1}
              className={`inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm leading-5 
              ${currentPage === 1 ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed' : 
              'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm leading-5 
                ${currentPage === i + 1 ? 'bg-primary-600 text-white border-primary-600' : 
                'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                {i + 1}
              </button>
            ))}
            
            <button
              onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
              disabled={currentPage === totalPages}
              className={`inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm leading-5 
              ${currentPage === totalPages ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed' : 
              'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesPage; 