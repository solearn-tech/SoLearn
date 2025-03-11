import React, { useState, ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  FiHome, 
  FiUsers, 
  FiBookOpen, 
  FiAward, 
  FiSettings, 
  FiDollarSign,
  FiBarChart2,
  FiHelpCircle,
  FiMenu,
  FiX,
  FiBell,
  FiSearch,
  FiLogOut
} from 'react-icons/fi';

interface LayoutProps {
  children: ReactNode;
}

interface NavItemProps {
  href: string;
  icon: ReactNode;
  title: string;
  active: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, title, active }) => {
  return (
    <Link
      href={href}
      className={`flex items-center px-4 py-3 rounded-lg ${
        active
          ? 'bg-primary-600 text-white'
          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700'
      }`}
    >
      <span className="mr-3 text-xl">{icon}</span>
      <span className="font-medium">{title}</span>
    </Link>
  );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { title: 'Dashboard', href: '/dashboard', icon: <FiHome /> },
    { title: 'Users', href: '/users', icon: <FiUsers /> },
    { title: 'Courses', href: '/courses', icon: <FiBookOpen /> },
    { title: 'Achievements', href: '/achievements', icon: <FiAward /> },
    { title: 'Tokens', href: '/tokens', icon: <FiDollarSign /> },
    { title: 'Analytics', href: '/analytics', icon: <FiBarChart2 /> },
    { title: 'Settings', href: '/settings', icon: <FiSettings /> },
    { title: 'Help', href: '/help', icon: <FiHelpCircle /> },
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900">
      {/* Sidebar for mobile */}
      <div
        className={`fixed inset-0 z-40 flex transform transition-all duration-300 lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
          onClick={toggleSidebar}
        ></div>

        {/* Sidebar */}
        <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white dark:bg-slate-800 pt-5 pb-4">
          <div className="absolute top-0 right-0 p-1">
            <button
              className="flex h-12 w-12 items-center justify-center rounded-full focus:outline-none focus:bg-gray-100 dark:focus:bg-slate-700"
              onClick={toggleSidebar}
            >
              <FiX className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          <div className="flex flex-shrink-0 items-center px-4">
            <img
              className="h-10 w-auto"
              src="/logo.svg"
              alt="SoLearn Admin"
            />
            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">SoLearn Admin</span>
          </div>

          <div className="mt-8 flex-1 overflow-y-auto">
            <nav className="px-2 space-y-1">
              {navigation.map((item) => (
                <NavItem
                  key={item.title}
                  href={item.href}
                  icon={item.icon}
                  title={item.title}
                  active={router.pathname === item.href}
                />
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex min-h-0 flex-1 flex-col bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700">
          <div className="flex flex-shrink-0 items-center h-16 px-4 border-b border-gray-200 dark:border-slate-700">
            <img
              className="h-10 w-auto"
              src="/logo.svg"
              alt="SoLearn Admin"
            />
            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">SoLearn Admin</span>
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <nav className="mt-5 flex-1 px-4 space-y-1">
              {navigation.map((item) => (
                <NavItem
                  key={item.title}
                  href={item.href}
                  icon={item.icon}
                  title={item.title}
                  active={router.pathname === item.href}
                />
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
          <button
            type="button"
            className="border-r border-gray-200 dark:border-slate-700 px-4 text-gray-500 lg:hidden"
            onClick={toggleSidebar}
          >
            <span className="sr-only">Open sidebar</span>
            <FiMenu className="h-6 w-6" />
          </button>
          
          {/* Search */}
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1 items-center">
              <div className="w-full max-w-lg lg:max-w-xs">
                <label htmlFor="search" className="sr-only">
                  Search
                </label>
                <div className="relative text-gray-400 focus-within:text-gray-600">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FiSearch className="h-5 w-5" />
                  </div>
                  <input
                    id="search"
                    className="block w-full rounded-md border-0 bg-gray-50 dark:bg-slate-700 py-2 pl-10 pr-3 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 sm:text-sm sm:leading-6"
                    placeholder="Search"
                    type="search"
                  />
                </div>
              </div>
            </div>
            
            {/* User profile and notification */}
            <div className="ml-4 flex items-center md:ml-6">
              {/* Notification button */}
              <button className="rounded-full bg-white dark:bg-slate-800 p-1 text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200">
                <span className="sr-only">View notifications</span>
                <FiBell className="h-6 w-6" />
              </button>

              {/* Profile dropdown */}
              <div className="relative ml-3">
                <div className="flex items-center">
                  <button className="bg-white dark:bg-slate-800 flex max-w-xs items-center rounded-full text-sm focus:outline-none">
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                  </button>
                  <span className="hidden md:flex md:items-center ml-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Admin User</span>
                    <button className="ml-3 text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300">
                      <FiLogOut className="h-5 w-5" />
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-slate-900">
          <div className="py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout; 