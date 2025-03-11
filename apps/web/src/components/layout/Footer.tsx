import React from 'react';
import Link from 'next/link';
import { FiTwitter, FiGithub, FiGlobe } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="md:col-span-1">
            <Link href="/" legacyBehavior>
              <a className="flex items-center">
                <span className="text-xl font-bold text-primary-600 dark:text-primary-400">Solearn</span>
              </a>
            </Link>
            <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
              Learn to Earn on Solana - A decentralized learning platform that rewards you for acquiring blockchain knowledge.
            </p>
            <div className="flex space-x-4 mt-4">
              <a 
                href="https://x.com/SOLEARN2314" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                title="Twitter"
              >
                <FiTwitter size={20} />
              </a>
              <a 
                href="https://github.com/solearn-tech/SoLearn" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
              >
                <FiGithub size={20} />
              </a>
              <a 
                href="https://www.solearn.co/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
              >
                <FiGlobe size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Platform
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/courses" legacyBehavior>
                  <a className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                    Courses
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/dashboard" legacyBehavior>
                  <a className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                    Dashboard
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/achievements" legacyBehavior>
                  <a className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                    Achievements
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/rewards" legacyBehavior>
                  <a className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                    Rewards
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/docs" legacyBehavior>
                  <a className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                    Documentation
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/faq" legacyBehavior>
                  <a className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                    FAQ
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/blog" legacyBehavior>
                  <a className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                    Blog
                  </a>
                </Link>
              </li>
              <li>
                <a 
                  href="https://github.com/solearn-tech/SoLearn" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" legacyBehavior>
                  <a className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                    Terms of Service
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/privacy" legacyBehavior>
                  <a className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                    Privacy Policy
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/cookies" legacyBehavior>
                  <a className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                    Cookie Policy
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Solearn. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 