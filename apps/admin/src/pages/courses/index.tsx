import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Table, { Column } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import { 
  HiOutlinePencil, 
  HiOutlineTrash, 
  HiOutlineEye,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineRefresh,
  HiOutlinePlus
} from 'react-icons/hi';

// Course interface
interface Course {
  id: string;
  title: string;
  instructor: string;
  category: string;
  duration: number; // in minutes
  lessons: number;
  students: number;
  rating: number;
  publishedDate: Date;
  status: 'published' | 'draft' | 'archived';
  thumbnailUrl?: string;
}

// Sample data
const SAMPLE_COURSES: Course[] = Array.from({ length: 25 }, (_, i) => ({
  id: `course-${i + 1}`,
  title: `Course ${i + 1}: ${['Solana Basics', 'Smart Contract Development', 'DeFi Fundamentals', 'NFT Creation', 'Web3 Security'][i % 5]}`,
  instructor: ['John Doe', 'Jane Smith', 'Alex Johnson', 'Emily Brown', 'Michael Wilson'][i % 5],
  category: ['Blockchain', 'Smart Contracts', 'DeFi', 'NFTs', 'Security'][i % 5],
  duration: Math.floor(Math.random() * 300) + 30,
  lessons: Math.floor(Math.random() * 20) + 3,
  students: Math.floor(Math.random() * 1000),
  rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
  publishedDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
  status: ['published', 'draft', 'archived'][Math.floor(Math.random() * 3)] as 'published' | 'draft' | 'archived',
  thumbnailUrl: `https://picsum.photos/200/120?random=${i}`
}));

const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [activeFilter, setActiveFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setCourses(SAMPLE_COURSES);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Format duration to readable string
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Format date to readable string
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Filter courses based on search term and status filter
  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      activeFilter === 'all' || 
      course.status === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  // Pagination logic
  const indexOfLastCourse = currentPage * itemsPerPage;
  const indexOfFirstCourse = indexOfLastCourse - itemsPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  // Table columns configuration
  const columns: Column<Course>[] = [
    {
      key: 'title',
      header: 'Course',
      render: (course) => (
        <div className="flex items-center">
          {course.thumbnailUrl && (
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="h-10 w-16 object-cover rounded mr-3"
            />
          )}
          <div>
            <div className="font-medium text-gray-900 dark:text-white">{course.title}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{course.category}</div>
          </div>
        </div>
      )
    },
    {
      key: 'instructor',
      header: 'Instructor',
      render: (course) => (
        <div className="text-sm text-gray-700 dark:text-gray-300">
          {course.instructor}
        </div>
      )
    },
    {
      key: 'details',
      header: 'Details',
      render: (course) => (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <div>{course.lessons} lessons</div>
          <div>{formatDuration(course.duration)}</div>
        </div>
      )
    },
    {
      key: 'students',
      header: 'Students',
      render: (course) => (
        <div className="text-sm text-gray-900 dark:text-white font-medium">
          {course.students.toLocaleString()}
        </div>
      )
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (course) => (
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-900 dark:text-white mr-1">
            {course.rating}
          </span>
          <div className="flex text-yellow-400">
            {Array.from({ length: 5 }, (_, i) => (
              <svg
                key={i}
                className={`h-4 w-4 ${i < Math.floor(course.rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (course) => {
        let statusClass = '';
        
        switch (course.status) {
          case 'published':
            statusClass = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            break;
          case 'draft':
            statusClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            break;
          case 'archived':
            statusClass = 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
            break;
        }
        
        return (
          <span className={`px-2 py-1 text-xs rounded-full capitalize ${statusClass}`}>
            {course.status}
          </span>
        );
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (course) => (
        <div className="flex space-x-2">
          <button className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
            <HiOutlineEye className="h-5 w-5" />
          </button>
          <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <HiOutlinePencil className="h-5 w-5" />
          </button>
          <button className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400">
            <HiOutlineTrash className="h-5 w-5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <AdminLayout>
      <PageHeader
        title="Course Management"
        subtitle="View and manage learning courses"
        actions={
          <Button variant="primary" size="md" icon={<HiOutlinePlus />}>
            Create New Course
          </Button>
        }
      />

      <Card>
        {/* Filters and search */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HiOutlineSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="secondary" 
                size="md" 
                icon={<HiOutlineRefresh />}
                onClick={() => {
                  setSearchTerm('');
                  setActiveFilter('all');
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>
          
          {/* Status filter tabs */}
          <div className="flex space-x-1 border-b border-gray-200 dark:border-gray-700">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeFilter === 'all'
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveFilter('all')}
            >
              All
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeFilter === 'published'
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveFilter('published')}
            >
              Published
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeFilter === 'draft'
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveFilter('draft')}
            >
              Draft
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeFilter === 'archived'
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveFilter('archived')}
            >
              Archived
            </button>
          </div>
        </div>

        {/* Courses table */}
        <Table
          columns={columns}
          data={currentCourses}
          loading={loading}
          emptyMessage="No courses found"
          rowKey="id"
        />

        {/* Pagination */}
        {!loading && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-0">
              Showing {indexOfFirstCourse + 1}-{Math.min(indexOfLastCourse, filteredCourses.length)} of {filteredCourses.length} courses
            </div>
            
            <div className="flex space-x-2">
              <button
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = currentPage > 3 ? 
                  (currentPage - Math.min(2, totalPages - currentPage) + i) : 
                  (i + 1);
                
                if (pageNum <= totalPages) {
                  return (
                    <button
                      key={pageNum}
                      className={`px-3 py-1 border ${
                        currentPage === pageNum
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      } rounded-md`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                }
                return null;
              })}
              
              <button
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Card>
    </AdminLayout>
  );
};

export default CoursesPage; 