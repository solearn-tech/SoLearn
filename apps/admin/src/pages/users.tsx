import React, { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiFilter, 
  FiEdit2, 
  FiTrash2, 
  FiUserPlus, 
  FiDownload,
  FiEye,
  FiUser,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';

// Mock user data
const MOCK_USERS = [
  { 
    id: '1', 
    name: 'Alice Johnson', 
    walletAddress: '8YLKot3Edw3KkMRscLUGdMXCNyLwqQ2B7sNz3WM7Eaa3', 
    email: 'alice@example.com', 
    role: 'Student', 
    progress: 78, 
    tokensEarned: 1250, 
    achievements: 8, 
    status: 'Active', 
    joinedAt: '2023-05-12'
  },
  { 
    id: '2', 
    name: 'Bob Smith', 
    walletAddress: 'F8c52KuQyEpYpEJMJWzGzqDN1zZLjhSpYxdoYnPp8f6u', 
    email: 'bob@example.com', 
    role: 'Student', 
    progress: 45, 
    tokensEarned: 680, 
    achievements: 3, 
    status: 'Active', 
    joinedAt: '2023-06-18'
  },
  { 
    id: '3', 
    name: 'Carol Davis', 
    walletAddress: 'Gn7S4LGsR1mieJcLg5dGPBqQVNKNTJ1dEKTEkNd7VNaB', 
    email: 'carol@example.com', 
    role: 'Instructor', 
    progress: 100, 
    tokensEarned: 3200, 
    achievements: 15, 
    status: 'Active', 
    joinedAt: '2023-02-05'
  },
  { 
    id: '4', 
    name: 'Dave Wilson', 
    walletAddress: 'AQYC1DKdh16BXvT6F3BdpTRVtEhYL1F4tJz7zAMNqBHy', 
    email: 'dave@example.com', 
    role: 'Student', 
    progress: 12, 
    tokensEarned: 150, 
    achievements: 1, 
    status: 'Inactive', 
    joinedAt: '2023-07-22'
  },
  { 
    id: '5', 
    name: 'Eve Brown', 
    walletAddress: 'D7Qk5xVvbP3Z1dQbmDBHxKMMj3QxAyRFqYfEerZV8AFd', 
    email: 'eve@example.com', 
    role: 'Admin', 
    progress: 95, 
    tokensEarned: 4500, 
    achievements: 20, 
    status: 'Active', 
    joinedAt: '2023-01-10'
  },
  { 
    id: '6', 
    name: 'Frank Miller', 
    walletAddress: 'HGbaK9EZLCn1DNQCyaHZNHfZeSWPHxFnXRBXwFVGHP4L', 
    email: 'frank@example.com', 
    role: 'Student', 
    progress: 36, 
    tokensEarned: 425, 
    achievements: 2, 
    status: 'Active', 
    joinedAt: '2023-06-30'
  },
  { 
    id: '7', 
    name: 'Grace Lee', 
    walletAddress: 'B9rJKnWEnK9LjgdZnfcFLQaRvH9JSQ3RJUbmLQgrtVzs', 
    email: 'grace@example.com', 
    role: 'Instructor', 
    progress: 92, 
    tokensEarned: 2800, 
    achievements: 12, 
    status: 'Active', 
    joinedAt: '2023-03-15'
  },
  { 
    id: '8', 
    name: 'Henry Taylor', 
    walletAddress: 'Ceukj2dHSHQcS1CbsUjTd8uQx4Fm17YGtTg7LW8JhSW6', 
    email: 'henry@example.com', 
    role: 'Student', 
    progress: 5, 
    tokensEarned: 50, 
    achievements: 0, 
    status: 'Inactive', 
    joinedAt: '2023-08-01'
  },
];

// User management page component
const UsersPage: React.FC = () => {
  const [users, setUsers] = useState(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  
  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.walletAddress.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === 'All' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'All' || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  
  // Handle page change
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRole, selectedStatus]);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Users</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-sm flex items-center"
        >
          <FiUserPlus className="mr-2" />
          Add User
        </button>
      </div>
      
      {/* Filters and search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="col-span-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:text-white sm:text-sm"
              placeholder="Search users by name, email, or wallet address"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div>
          <select
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="All">All Roles</option>
            <option value="Student">Student</option>
            <option value="Instructor">Instructor</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        
        <div>
          <select
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>
      
      {/* Users table */}
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                User
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Wallet Address
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Progress
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Tokens
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {currentUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center">
                      <FiUser className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${user.role === 'Admin' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' : 
                      user.role === 'Instructor' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' : 
                      'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'}`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-primary-600 h-2.5 rounded-full" 
                      style={{ width: `${user.progress}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{user.progress}%</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {user.tokensEarned} LEARN
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${user.status === 'Active' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 
                    'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'}`}
                  >
                    {user.status}
                  </span>
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
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{' '}
            <span className="font-medium">
              {indexOfLastUser > filteredUsers.length ? filteredUsers.length : indexOfLastUser}
            </span>{' '}
            of <span className="font-medium">{filteredUsers.length}</span> users
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
              disabled={currentPage === 1}
              className={`inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm leading-5 
              ${currentPage === 1 ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed' : 
              'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            >
              <FiChevronLeft className="mr-1" />
              Previous
            </button>
            
            <button
              onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
              disabled={currentPage === totalPages}
              className={`inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm leading-5 
              ${currentPage === totalPages ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed' : 
              'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            >
              Next
              <FiChevronRight className="ml-1" />
            </button>
          </div>
        </div>
      )}
      
      {/* Export Button */}
      <div className="mt-6">
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none">
          <FiDownload className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
          Export Users
        </button>
      </div>
    </div>
  );
};

export default UsersPage; 