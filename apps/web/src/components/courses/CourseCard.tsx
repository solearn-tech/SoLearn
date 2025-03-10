import Link from 'next/link';
import Image from 'next/image';
import { FiClock, FiStar, FiUsers, FiAward } from 'react-icons/fi';

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  rating: number;
  enrollmentCount: number;
  tokenReward: number;
  category: string;
}

export default function CourseCard({
  id,
  title,
  description,
  thumbnailUrl,
  level,
  duration,
  rating,
  enrollmentCount,
  tokenReward,
  category,
}: CourseCardProps) {
  // Format duration to hours and minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins > 0 ? `${mins}m` : ''}` : `${mins}m`;
  };

  // Badge colors based on level
  const levelColor = {
    beginner: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    intermediate: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    advanced: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative h-48 w-full">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
            <span className="text-white text-4xl font-bold">{title.charAt(0)}</span>
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${levelColor[level]}`}>
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-200">
            {category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
          {title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 text-sm">
          {description}
        </p>
        
        <div className="flex flex-wrap items-center justify-between text-sm mb-4">
          <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2 mr-4">
            <FiClock className="mr-1" />
            <span>{formatDuration(duration)}</span>
          </div>
          
          <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2 mr-4">
            <FiStar className="mr-1 text-yellow-500" />
            <span>{rating.toFixed(1)}</span>
          </div>
          
          <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2">
            <FiUsers className="mr-1" />
            <span>{enrollmentCount > 1000 ? `${(enrollmentCount / 1000).toFixed(1)}k` : enrollmentCount}</span>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center text-learn-600 dark:text-learn-400">
            <FiAward className="mr-1" />
            <span className="font-semibold">{tokenReward} $LEARN</span>
          </div>
          
          <Link 
            href={`/courses/${id}`}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            View Course
          </Link>
        </div>
      </div>
    </div>
  );
} 