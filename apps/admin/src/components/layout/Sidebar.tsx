import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  HiOutlineHome,
  HiOutlineUsers,
  HiOutlineBookOpen,
  HiOutlineCurrencyDollar,
  HiOutlineCog,
  HiOutlineChartBar,
  HiOutlineBadgeCheck,
  HiOutlineDocumentReport,
  HiOutlineLogout
} from 'react-icons/hi';

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ href, icon, title, active }) => {
  return (
    <Link href={href}>
      <a className={`flex items-center px-4 py-3 text-sm transition-colors duration-150 ${
        active 
          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-md font-medium' 
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md'
      }`}>
        <span className="mr-3 text-lg">{icon}</span>
        <span>{title}</span>
      </a>
    </Link>
  );
};

export const Sidebar: React.FC = () => {
  const router = useRouter();
  const currentPath = router.pathname;

  const isActive = (path: string) => {
    if (path === '/admin' && currentPath === '/admin') {
      return true;
    }
    if (path !== '/admin' && currentPath.startsWith(path)) {
      return true;
    }
    return false;
  };

  return (
    <div className="h-full w-64 flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-800">
          <Link href="/admin">
            <a className="text-xl font-bold text-primary-600 dark:text-primary-400">
              SoLearn Admin
            </a>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="px-2 space-y-1">
            <li>
              <SidebarItem 
                href="/admin" 
                icon={<HiOutlineHome />} 
                title="Dashboard" 
                active={isActive('/admin')}
              />
            </li>
            <li>
              <SidebarItem 
                href="/admin/users" 
                icon={<HiOutlineUsers />} 
                title="Users" 
                active={isActive('/admin/users')}
              />
            </li>
            <li>
              <SidebarItem 
                href="/admin/courses" 
                icon={<HiOutlineBookOpen />} 
                title="Courses" 
                active={isActive('/admin/courses')}
              />
            </li>
            <li>
              <SidebarItem 
                href="/admin/achievements" 
                icon={<HiOutlineBadgeCheck />} 
                title="Achievements" 
                active={isActive('/admin/achievements')}
              />
            </li>
            <li>
              <SidebarItem 
                href="/admin/rewards" 
                icon={<HiOutlineCurrencyDollar />} 
                title="Rewards" 
                active={isActive('/admin/rewards')}
              />
            </li>
            <li>
              <SidebarItem 
                href="/admin/analytics" 
                icon={<HiOutlineChartBar />} 
                title="Analytics" 
                active={isActive('/admin/analytics')}
              />
            </li>
            <li>
              <SidebarItem 
                href="/admin/reports" 
                icon={<HiOutlineDocumentReport />} 
                title="Reports" 
                active={isActive('/admin/reports')}
              />
            </li>
            <li>
              <SidebarItem 
                href="/admin/settings" 
                icon={<HiOutlineCog />} 
                title="Settings" 
                active={isActive('/admin/settings')}
              />
            </li>
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button className="flex items-center w-full px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
            <HiOutlineLogout className="mr-3 text-lg" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 