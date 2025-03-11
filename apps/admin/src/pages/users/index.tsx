import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Table, { Column } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import { 
  HiOutlinePencil, 
  HiOutlineTrash, 
  HiOutlineBadgeCheck,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineRefresh
} from 'react-icons/hi';

// User interface
interface User {
  id: string;
  name: string;
  walletAddress: string;
  email?: string;
  joinedDate: Date;
  lastActive: Date;
  coursesCompleted: number;
  tokensEarned: number;
  achievements: number;
  status: 'active' | 'inactive' | 'suspended';
}

// Sample data
const SAMPLE_USERS: User[] = Array.from({ length: 50 }, (_, i) => ({
  id: `user-${i + 1}`,
  name: `User ${i + 1}`,
  walletAddress: `5${Math.random().toString(36).substring(2, 14)}...${Math.random().toString(36).substring(2, 6)}`,
  email: i % 3 === 0 ? `user${i + 1}@example.com` : undefined,
  joinedDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
  lastActive: new Date(Date.now() - Math.floor(Math.random() * 1000000000)),
  coursesCompleted: Math.floor(Math.random() * 20),
  tokensEarned: Math.floor(Math.random() * 50000),
  achievements: Math.floor(Math.random() * 15),
  status: ['active', 'inactive', 'suspended'][Math.floor(Math.random() * 3)] as 'active' | 'inactive' | 'suspended',
}));

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setUsers(SAMPLE_USERS);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Format date to readable string
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.walletAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination logic
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Table columns configuration
  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (user) => (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 mr-3">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
            {user.email && <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>}
          </div>
        </div>
      )
    },
    {
      key: 'walletAddress',
      header: 'Wallet Address',
      render: (user) => (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {user.walletAddress}
        </div>
      )
    },
    {
      key: 'joinedDate',
      header: 'Joined',
      render: (user) => (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(user.joinedDate)}
        </div>
      )
    },
    {
      key: 'coursesCompleted',
      header: 'Courses',
      render: (user) => (
        <div className="text-sm text-gray-900 dark:text-white">
          {user.coursesCompleted}
        </div>
      )
    },
    {
      key: 'tokensEarned',
      header: 'Tokens',
      render: (user) => (
        <div className="text-sm text-gray-900 dark:text-white font-medium">
          {user.tokensEarned.toLocaleString()} LEARN
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (user) => {
        let statusClass = '';
        
        switch (user.status) {
          case 'active':
            statusClass = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            break;
          case 'inactive':
            statusClass = 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
            break;
          case 'suspended':
            statusClass = 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            break;
        }
        
        return (
          <span className={`px-2 py-1 text-xs rounded-full capitalize ${statusClass}`}>
            {user.status}
          </span>
        );
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (user) => (
        <div className="flex space-x-2">
          <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <HiOutlinePencil className="h-5 w-5" />
          </button>
          <button className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400">
            <HiOutlineTrash className="h-5 w-5" />
          </button>
          <button className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
            <HiOutlineBadgeCheck className="h-5 w-5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <AdminLayout>
      <PageHeader
        title="User Management"
        subtitle="View and manage platform users"
        actions={
          <Button variant="primary" size="md">
            Add New User
          </Button>
        }
      />

      <Card>
        {/* Search and filters */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiOutlineSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2">
            <Button variant="secondary" size="md" icon={<HiOutlineFilter />}>
              Filter
            </Button>
            <Button 
              variant="secondary" 
              size="md" 
              icon={<HiOutlineRefresh />}
              onClick={() => setSearchTerm('')}
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Users table */}
        <Table
          columns={columns}
          data={currentUsers}
          loading={loading}
          emptyMessage="No users found"
          rowKey="id"
        />

        {/* Pagination */}
        {!loading && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-0">
              Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
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

export default UsersPage; 