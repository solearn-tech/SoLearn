declare module 'react';
declare module 'next/router';
declare module 'next/image';
declare module 'next/head';
declare module 'next/link';
declare module 'react-icons/fi';

// Chinese comment replaced with English comment
namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

// Chinese comment replaced with English comment
interface WalletContextProviderProps {
  children: React.ReactNode;
}

// Chinese comment replaced with English comment
interface Course {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  rating: number;
  enrollmentCount: number;
  tokenReward: number;
  category: string;
  instructor?: string;
  instructorTitle?: string;
  instructorAvatar?: string;
  modules: CourseModule[];
  prerequisites: string[];
  whatYouWillLearn: string[];
  longDescription: string;
}

interface CourseModule {
  id: string;
  title: string;
  duration: number;
  lessons: CourseLesson[];
}

interface CourseLesson {
  id: string;
  title: string;
  duration: number;
  completed: boolean;
} 